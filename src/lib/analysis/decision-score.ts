export type DecisionScoreInputs = {
  environmentalRisk: number;
  timePenalty: number;
};

export function calculateDecisionScore({
  environmentalRisk,
  timePenalty,
}: DecisionScoreInputs): number {
  if (
    !Number.isFinite(environmentalRisk) ||
    !Number.isFinite(timePenalty)
  ) {
    throw new Error("Decision score inputs must be finite numbers.");
  }

  return 0.75 * environmentalRisk + 0.25 * timePenalty;
}

export const getDecisionScore = calculateDecisionScore;