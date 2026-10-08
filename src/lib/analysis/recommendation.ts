export const CRITICAL_ENVIRONMENTAL_RISK = 90;

export type RecommendationCandidate = {
  routeId: string;
  environmentalRisk: number;
};

export type CriticalRiskGateResult = {
  candidates: RecommendationCandidate[];
  status: "safer_option_found" | "lowest_risk_available";
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
 * When at least one non-critical route exists, critical routes are excluded
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

export const getCriticalRiskGate = applyCriticalRiskGate;