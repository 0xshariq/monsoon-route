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

export const getCriticalRiskGate = applyCriticalRiskGate;
export const rankRecommendationCandidates = rankRoutes;