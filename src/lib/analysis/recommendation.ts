import type { RecommendationEvidence } from "@/types/route";

export const CRITICAL_ENVIRONMENTAL_RISK = 90;

export type RecommendationCandidate = {
  routeId: string;
  environmentalRisk: number;
};

export type CriticalRiskGateResult = {
  candidates: RecommendationCandidate[];
  status: "safer_option_found" | "lowest_risk_available";
};

export type RankedRecommendationCandidate = RecommendationCandidate & {
  decisionScore: number;
  travelTimeSeconds: number;
};

export type RecommendationMetrics = {
  routeId: string;
  travelTimeSeconds: number;
  environmentalRisk: number;
  waterloggingRisk: number;
  decisionScore: number;
  highRiskHotspotCount: number;
  rainRisk?: number;
  totalPrecipitationMm?: number;
  peakHourlyPrecipitationMm?: number;
};

export type RecommendationInput = {
  recommendedRoute: RecommendationMetrics;
  fastestRoute: RecommendationMetrics;
  status: "safer_option_found" | "lowest_risk_available";
};

export type RecommendationResult = {
  recommendedRouteId: string;
  status: "safer_option_found" | "lowest_risk_available";
  reason: {
    timeDifferenceMinutes: number;
    environmentalRiskDifference: number;
    waterloggingRiskDifference: number;
    avoidedHighRiskHotspots: number;
    decisionScoreDifference: number;
  };
  evidence: RecommendationEvidence[];
};

function isCritical(environmentalRisk: number): boolean {
  if (!Number.isFinite(environmentalRisk)) {
    throw new Error("Environmental risk must be a finite number.");
  }

  return environmentalRisk >= CRITICAL_ENVIRONMENTAL_RISK;
}

/**
 * Applies the critical environmental-risk gate before normal route ranking.
 *
 * When at least one non-critical candidate exists, critical routes are excluded
 * from the candidate set.
 *
 * When every route is critical, all routes remain available and the result
 * is marked as lowest_risk_available. The system does not claim that any
 * route is absolutely safe.
 */
export function applyCriticalRiskGate(
  candidates: RecommendationCandidate[],
): CriticalRiskGateResult {
  if (candidates.length === 0) {
    throw new Error("At least one route candidate is required.");
  }

  const nonCriticalCandidates = candidates.filter(
    ({ environmentalRisk }) => !isCritical(environmentalRisk),
  );

  if (nonCriticalCandidates.length > 0) {
    return {
      candidates: nonCriticalCandidates,
      status: "safer_option_found",
    };
  }

  return {
    candidates: [...candidates],
    status: "lowest_risk_available",
  };
}

/**
 * Ranks routes using the frozen deterministic ordering:
 *
 * 1. lower decision score
 * 2. lower environmental risk
 * 3. lower travel time
 * 4. stable/original route order
 *
 * Lower values are always better.
 */
export function rankRoutes(
  candidates: RankedRecommendationCandidate[],
): RankedRecommendationCandidate[] {
  candidates.forEach((candidate) => {
    if (!candidate.routeId) {
      throw new Error("Recommendation candidate must have a route ID.");
    }

    if (
      !Number.isFinite(candidate.decisionScore) ||
      !Number.isFinite(candidate.environmentalRisk) ||
      !Number.isFinite(candidate.travelTimeSeconds)
    ) {
      throw new Error(
        "Recommendation candidate scores and travel time must be finite numbers.",
      );
    }

    if (candidate.travelTimeSeconds < 0) {
      throw new Error("Recommendation candidate travel time cannot be negative.");
    }
  });

  return candidates
    .map((candidate, index) => ({
      candidate,
      originalIndex: index,
    }))
    .sort((a, b) => {
      const decisionScoreDifference =
        a.candidate.decisionScore - b.candidate.decisionScore;

      if (decisionScoreDifference !== 0) {
        return decisionScoreDifference;
      }

      const environmentalRiskDifference =
        a.candidate.environmentalRisk - b.candidate.environmentalRisk;

      if (environmentalRiskDifference !== 0) {
        return environmentalRiskDifference;
      }

      const travelTimeDifference =
        a.candidate.travelTimeSeconds - b.candidate.travelTimeSeconds;

      if (travelTimeDifference !== 0) {
        return travelTimeDifference;
      }

      return a.originalIndex - b.originalIndex;
    })
    .map(({ candidate }) => candidate);
}

/**
 * Builds the deterministic recommendation contract from already-computed
 * route metrics.
 *
 * Reason differences are expressed relative to the fastest route:
 *
 * - positive time difference means the recommendation takes longer;
 * - positive environmental-risk difference means the recommendation avoids risk;
 * - positive waterlogging-risk difference means the recommendation avoids
 *   waterlogging risk;
 * - positive avoided-hotspot count means the recommendation avoids more
 *   high-risk hotspots;
 * - positive decision-score difference means the recommendation has the
 *   better decision score.
 *
 * When the recommended route is already the fastest route, all comparison
 * differences are zero. This prevents the explanation from claiming that the
 * recommended route is slower.
 */
export function createRecommendation({
  recommendedRoute,
  fastestRoute,
  status,
}: RecommendationInput): RecommendationResult {
  validateRecommendationMetrics(recommendedRoute);
  validateRecommendationMetrics(fastestRoute);

  const timeDifferenceMinutes =
    (recommendedRoute.travelTimeSeconds - fastestRoute.travelTimeSeconds) / 60;

  const environmentalRiskDifference =
    fastestRoute.environmentalRisk - recommendedRoute.environmentalRisk;

  const waterloggingRiskDifference =
    fastestRoute.waterloggingRisk - recommendedRoute.waterloggingRisk;

  const avoidedHighRiskHotspots =
    fastestRoute.highRiskHotspotCount -
    recommendedRoute.highRiskHotspotCount;

  const decisionScoreDifference =
    fastestRoute.decisionScore - recommendedRoute.decisionScore;

  const evidence = generateRecommendationEvidence({
    recommendedRoute,
    timeDifferenceMinutes,
    waterloggingRiskDifference,
    avoidedHighRiskHotspots,
  });

  return {
    recommendedRouteId: recommendedRoute.routeId,
    status,
    reason: {
      timeDifferenceMinutes,
      environmentalRiskDifference,
      waterloggingRiskDifference,
      avoidedHighRiskHotspots,
      decisionScoreDifference,
    },
    evidence,
  };
}

function generateRecommendationEvidence({
  recommendedRoute,
  timeDifferenceMinutes,
  waterloggingRiskDifference,
  avoidedHighRiskHotspots,
}: {
  recommendedRoute: RecommendationMetrics;
  timeDifferenceMinutes: number;
  waterloggingRiskDifference: number;
  avoidedHighRiskHotspots: number;
}): RecommendationEvidence[] {
  const evidence: RecommendationEvidence[] = [];

  if (avoidedHighRiskHotspots > 0) {
    evidence.push({
      type: "waterlogging",
      message: `${recommendedRoute.routeId} avoids ${avoidedHighRiskHotspots} high-risk hotspot${avoidedHighRiskHotspots === 1 ? "" : "s"}.`,
    });
  } else if (waterloggingRiskDifference > 0) {
    evidence.push({
      type: "waterlogging",
      message: `${recommendedRoute.routeId} has lower estimated waterlogging risk.`,
    });
  }

  if (
    recommendedRoute.rainRisk !== undefined &&
    Number.isFinite(recommendedRoute.rainRisk) &&
    recommendedRoute.rainRisk > 0
  ) {
    evidence.push({
      type: "rain",
      message: `${recommendedRoute.routeId} accounts for forecast rain risk during the journey window.`,
    });
  }

  if (timeDifferenceMinutes > 0) {
    evidence.push({
      type: "travel-time",
      message: `${recommendedRoute.routeId} takes about ${formatMinutes(timeDifferenceMinutes)} more minute${Math.abs(timeDifferenceMinutes - 1) < 0.000001 ? "" : "s"} than the fastest route.`,
    });
  } else if (timeDifferenceMinutes === 0) {
    evidence.push({
      type: "travel-time",
      message: `${recommendedRoute.routeId} is the fastest available route.`,
    });
  }

  if (evidence.length === 0) {
    evidence.push({
      type: "travel-time",
      message: `${recommendedRoute.routeId} is recommended based on the computed route comparison.`,
    });
  }

  return evidence;
}

function formatMinutes(minutes: number): number {
  return Math.round(minutes * 10) / 10;
}

function validateRecommendationMetrics(
  route: RecommendationMetrics,
): void {
  if (!route.routeId) {
    throw new Error("Recommendation route must have a route ID.");
  }

  if (
    !Number.isFinite(route.travelTimeSeconds) ||
    !Number.isFinite(route.environmentalRisk) ||
    !Number.isFinite(route.waterloggingRisk) ||
    !Number.isFinite(route.decisionScore) ||
    !Number.isFinite(route.highRiskHotspotCount)
  ) {
    throw new Error("Recommendation metrics must be finite numbers.");
  }

  if (route.travelTimeSeconds < 0) {
    throw new Error("Recommendation travel time cannot be negative.");
  }

  if (route.highRiskHotspotCount < 0) {
    throw new Error("High-risk hotspot count cannot be negative.");
  }
}

export const getCriticalRiskGate = applyCriticalRiskGate;
export const rankRecommendationCandidates = rankRoutes;
export const buildRecommendation = createRecommendation;