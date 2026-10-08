import { NextResponse } from "next/server";

import {
  calculateDecisionScore,
} from "@/lib/analysis/decision-score";
import {
  calculateEnvironmentalRisk,
} from "@/lib/analysis/environmental-risk";
import {
  getRainMetrics,
} from "@/lib/analysis/rain-risk";
import {
  createRecommendation,
  applyCriticalRiskGate,
  rankRoutes,
  type RankedRecommendationCandidate,
  type RecommendationMetrics,
} from "@/lib/analysis/recommendation";
import {
  calculateTimePenalty,
} from "@/lib/analysis/time-penalty";
import {
  calculateWaterloggingRisk,
  HOTSPOT_CORRIDOR_METERS,
} from "@/lib/analysis/waterlogging-risk";
import { getHotspotDistance } from "@/lib/geo/hotspot-distance";
import { filterHotspotsByRoute } from "@/lib/geo/spatial-filter";
import { getGoogleRoutes } from "@/lib/providers/google-routes";
import { getOpenMeteoForecast } from "@/lib/providers/open-meteo";
import {
  getInvalidRequestMessage,
  validateRouteRequest,
} from "@/lib/validation";
import type { WaterloggingHotspot } from "@/types/hotspot";
import type { Route, RouteAnalysis } from "@/types/route";
import type { WeatherSnapshot } from "@/lib/providers/open-meteo";

export const runtime = "nodejs";

import hotspotDataset from "@/data/mumbai-region-waterlogging-hotspots.geojson";

type HotspotFeature = {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    severity: WaterloggingHotspot["severity"];
    documentedEventCount: number;
    authority: string;
    evidence: string[];
  };
  geometry: WaterloggingHotspot["geometry"];
};

type HotspotFeatureCollection = {
  type: "FeatureCollection";
  features: HotspotFeature[];
};

type AnalyzeRouteResponse = {
  routes: RouteAnalysis[];
  recommendation: ReturnType<typeof createRecommendation>;
  hotspots: WaterloggingHotspot[];
};

const dataset = hotspotDataset as HotspotFeatureCollection;

function toHotspot(feature: HotspotFeature): WaterloggingHotspot {
  const representativeLocation =
    feature.geometry.type === "Point"
      ? {
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0],
        }
      : {
          lat: feature.geometry.coordinates[0][1][1],
          lon: feature.geometry.coordinates[0][0][0],
        };

  return {
    id: feature.properties.id,
    name: feature.properties.name,
    geometry: feature.geometry,
    representativeLocation,
    severity: feature.properties.severity,
    documentedEventCount: feature.properties.documentedEventCount,
    authority: feature.properties.authority,
    evidence: feature.properties.evidence,
  };
}

const hotspots = dataset.features.map(toHotspot);

function createErrorResponse(
  status: number,
  code:
    | "INVALID_REQUEST"
    | "NO_ROUTE"
    | "ROUTING_PROVIDER_ERROR"
    | "WEATHER_PROVIDER_ERROR"
    | "ANALYSIS_ERROR",
  message: string,
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

function isNoRouteError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.toLowerCase().includes("no candidate routes")
  );
}

function getRouteHotspotExposures(
  route: Route,
): {
  hotspot: WaterloggingHotspot;
  distanceMeters: number;
}[] {
  const candidates = filterHotspotsByRoute(route.geometry, hotspots);

  const uniqueCandidates = new Map(
    candidates.map((hotspot) => [hotspot.id, hotspot]),
  );

  return [...uniqueCandidates.values()]
    .map((hotspot) => ({
      hotspot,
      distanceMeters: getHotspotDistance(hotspot, route),
    }))
    .filter(
      ({ distanceMeters }) =>
        Number.isFinite(distanceMeters) &&
        distanceMeters <= HOTSPOT_CORRIDOR_METERS,
    );
}

function analyzeRoute(
  route: Route,
  weather: WeatherSnapshot,
  departureTime: string,
  fastestTimeSeconds: number,
): {
  analysis: RouteAnalysis;
  metrics: RecommendationMetrics;
  exposedHotspots: WaterloggingHotspot[];
} {
  const rain = getRainMetrics(route, weather, departureTime);
  const exposures = getRouteHotspotExposures(route);

  const waterloggingExposures = exposures.map(
    ({ hotspot, distanceMeters }) => ({
      distanceMeters,
      severity: hotspot.severity,
      documentedEventCount: hotspot.documentedEventCount,
    }),
  );

  const waterloggingRisk = calculateWaterloggingRisk(waterloggingExposures);
  const environmentalRiskScore = calculateEnvironmentalRisk({
    waterloggingRisk,
    rainRisk: rain.rainRisk,
  });
  const timePenalty = calculateTimePenalty(
    route.durationSeconds,
    fastestTimeSeconds,
  );
  const decisionScore = calculateDecisionScore({
    environmentalRisk: environmentalRiskScore,
    timePenalty,
  });

  const highRiskHotspotCount = exposures.filter(
    ({ hotspot }) => hotspot.severity === "high",
  ).length;

  const metrics: RecommendationMetrics = {
    routeId: route.id,
    travelTimeSeconds: route.durationSeconds,
    environmentalRisk: environmentalRiskScore,
    waterloggingRisk,
    decisionScore,
    highRiskHotspotCount,
    rainRisk: rain.rainRisk,
    totalPrecipitationMm: rain.totalPrecipitationMm,
    peakHourlyPrecipitationMm: rain.peakHourlyPrecipitationMm,
  };

  return {
    analysis: {
      route,
      waterlogging: {
        riskScore: waterloggingRisk,
        exposedHotspots: exposures.length,
        highRiskHotspotCount,
      },
      rain,
      environmentalRiskScore,
      timePenalty,
      decisionScore,
      evidence: [],
    },
    metrics,
    exposedHotspots: exposures.map(({ hotspot }) => hotspot),
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    console.error("Failed to parse /api/analyze-route request body.", error);
    return createErrorResponse(
      400,
      "INVALID_REQUEST",
      "Request body must be valid JSON.",
    );
  }

  const validation = validateRouteRequest(body);

  if (!validation.success) {
    return createErrorResponse(
      400,
      "INVALID_REQUEST",
      getInvalidRequestMessage(validation.error),
    );
  }

  const routeRequest = validation.data;

  let routes: Route[];

  try {
    routes = await getGoogleRoutes(routeRequest);
  } catch (error) {
    if (isNoRouteError(error)) {
      return createErrorResponse(
        422,
        "NO_ROUTE",
        "No route could be found between the selected locations.",
      );
    }

    console.error("Google Routes provider failed.", error);
    return createErrorResponse(
      502,
      "ROUTING_PROVIDER_ERROR",
      "The routing provider could not provide route candidates.",
    );
  }

  if (routes.length === 0) {
    return createErrorResponse(
      422,
      "NO_ROUTE",
      "No route could be found between the selected locations.",
    );
  }

  let weatherSnapshots: WeatherSnapshot[];

  try {
    weatherSnapshots = await getOpenMeteoForecast(routes);
  } catch (error) {
    console.error("Open-Meteo provider failed.", error);
    return createErrorResponse(
      502,
      "WEATHER_PROVIDER_ERROR",
      "The weather provider could not provide the forecast needed for route analysis.",
    );
  }

  try {
    const fastestTimeSeconds = Math.min(
      ...routes.map(({ durationSeconds }) => durationSeconds),
    );

    if (!Number.isFinite(fastestTimeSeconds) || fastestTimeSeconds <= 0) {
      throw new Error("Route candidates contain an invalid fastest travel time.");
    }

    const weatherByRouteId = new Map(
      weatherSnapshots.map((snapshot) => [snapshot.routeId, snapshot]),
    );

    const analyses = routes.map((route) => {
      const weather = weatherByRouteId.get(route.id);

      if (!weather) {
        throw new Error(`Missing weather snapshot for route ${route.id}.`);
      }

      return analyzeRoute(
        route,
        weather,
        routeRequest.departureTime,
        fastestTimeSeconds,
      );
    });

    const candidateMetrics = analyses.map(
      ({ metrics }): RankedRecommendationCandidate => ({
        routeId: metrics.routeId,
        environmentalRisk: metrics.environmentalRisk,
        decisionScore: metrics.decisionScore,
        travelTimeSeconds: metrics.travelTimeSeconds,
      }),
    );

    const gate = applyCriticalRiskGate(
      candidateMetrics.map(({ routeId, environmentalRisk }) => ({
        routeId,
        environmentalRisk,
      })),
    );

    const gatedIds = new Set(gate.candidates.map(({ routeId }) => routeId));
    const ranked = rankRoutes(
      candidateMetrics.filter(({ routeId }) => gatedIds.has(routeId)),
    );

    const recommendedRouteId = ranked[0]?.routeId;

    if (!recommendedRouteId) {
      throw new Error("Recommendation ranking produced no route.");
    }

    const metricsByRouteId = new Map(
      analyses.map(({ metrics }) => [metrics.routeId, metrics]),
    );
    const recommendedMetrics = metricsByRouteId.get(recommendedRouteId);
    const fastestRoute = routes.reduce((fastest, route) =>
      route.durationSeconds < fastest.durationSeconds ? route : fastest,
    );
    const fastestMetrics = metricsByRouteId.get(fastestRoute.id);

    if (!recommendedMetrics || !fastestMetrics) {
      throw new Error("Recommendation metrics are incomplete.");
    }

    const recommendation = createRecommendation({
      recommendedRoute: recommendedMetrics,
      fastestRoute: fastestMetrics,
      status: gate.status,
    });

    const routeAnalyses = analyses.map(({ analysis }) => ({
      ...analysis,
      evidence:
        analysis.route.id === recommendation.recommendedRouteId
          ? [...recommendation.evidence]
          : [],
    }));

    const relevantHotspots = [
      ...new Map(
        analyses
          .flatMap(({ exposedHotspots }) => exposedHotspots)
          .map((hotspot) => [hotspot.id, hotspot]),
      ).values(),
    ];

    const response: AnalyzeRouteResponse = {
      routes: routeAnalyses,
      recommendation,
      hotspots: relevantHotspots,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Deterministic route analysis failed.", error);
    return createErrorResponse(
      500,
      "ANALYSIS_ERROR",
      "Route analysis could not be completed.",
    );
  }
}
