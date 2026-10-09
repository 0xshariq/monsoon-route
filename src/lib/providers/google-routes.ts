import type { Route, RouteRequest } from "@/types/route";
import { fetchWithTimeout, releaseFetchTimeout } from "@/lib/providers/request-timeout";

const GOOGLE_ROUTES_URL =
  "https://routes.googleapis.com/directions/v2:computeRoutes";
const GOOGLE_ROUTES_FIELD_MASK =
  "routes.routeLabels,routes.duration,routes.distanceMeters,routes.polyline";

type GoogleRouteResponse = {
  routes?: Array<{
    duration?: string;
    distanceMeters?: number;
    polyline?: {
      geoJsonLinestring?: {
        type?: string;
        coordinates?: unknown;
      };
    };
  }>;
};

function isCoordinatePair(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    Number.isFinite(value[0]) &&
    typeof value[1] === "number" &&
    Number.isFinite(value[1])
  );
}

function normalizeGeometry(value: unknown): Route["geometry"] {
  if (
    !value ||
    typeof value !== "object" ||
    (value as { type?: unknown }).type !== "LineString"
  ) {
    throw new Error("Google Routes returned invalid route geometry.");
  }

  const coordinates = (value as { coordinates?: unknown }).coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    throw new Error("Google Routes returned an empty route geometry.");
  }

  if (!coordinates.every(isCoordinatePair)) {
    throw new Error("Google Routes returned invalid route coordinates.");
  }

  return {
    type: "LineString",
    coordinates,
  };
}

function parseDuration(duration: string | undefined): number {
  if (!duration) {
    throw new Error("Google Routes returned a route without a duration.");
  }

  const match = /^(\d+(?:\.\d+)?)s$/.exec(duration);
  if (!match) {
    throw new Error("Google Routes returned an invalid route duration.");
  }

  const seconds = Number(match[1]);
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new Error("Google Routes returned an invalid route duration.");
  }

  return Math.round(seconds);
}

function buildRequestBody(request: RouteRequest) {
  return {
    origin: {
      location: {
        latLng: {
          latitude: request.origin.lat,
          longitude: request.origin.lon,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: request.destination.lat,
          longitude: request.destination.lon,
        },
      },
    },
    travelMode: request.travelMode,
    computeAlternativeRoutes: true,
    polylineQuality: "HIGH_QUALITY",
    polylineEncoding: "GEO_JSON_LINESTRING",
  } as const;
}

export async function getGoogleRoutes(request: RouteRequest): Promise<Route[]> {
  const apiKey = process.env.GOOGLE_ROUTES_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_ROUTES_API_KEY is not configured.");
  }

  const response = await fetchWithTimeout(GOOGLE_ROUTES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": GOOGLE_ROUTES_FIELD_MASK,
    },
    body: JSON.stringify(buildRequestBody(request)),
  }, 12000);

  try {
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(
        `Google Routes request failed with status ${response.status}: ${detail.slice(0, 300)}`,
      );
    }

    const payload = (await response.json()) as GoogleRouteResponse;
  if (!Array.isArray(payload.routes) || payload.routes.length === 0) {
    throw new Error("Google Routes returned no candidate routes.");
  }

    return payload.routes.map((googleRoute, index) => ({
      id: `route-${index}`,
      label: index === 0 ? "default" : "alternative",
      durationSeconds: parseDuration(googleRoute.duration),
      distanceMeters:
        typeof googleRoute.distanceMeters === "number" &&
        Number.isFinite(googleRoute.distanceMeters) &&
        googleRoute.distanceMeters >= 0
          ? googleRoute.distanceMeters
          : (() => {
              throw new Error("Google Routes returned an invalid route distance.");
            })(),
      geometry: normalizeGeometry(googleRoute.polyline?.geoJsonLinestring),
    }));
  } finally {
    releaseFetchTimeout(response);
  }
}

export const fetchGoogleRoutes = getGoogleRoutes;
