export type EnvironmentalRiskInputs = {
  waterloggingRisk: number;
  rainRisk: number;
};

export function calculateEnvironmentalRisk({
  waterloggingRisk,
  rainRisk,
}: EnvironmentalRiskInputs): number {
  if (!Number.isFinite(waterloggingRisk) || !Number.isFinite(rainRisk)) {
    throw new Error("Environmental risk inputs must be finite numbers.");
  }

  return 0.7 * waterloggingRisk + 0.3 * rainRisk;
}

export const getEnvironmentalRisk = calculateEnvironmentalRisk;
