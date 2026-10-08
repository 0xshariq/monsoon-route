import type { HotspotSeverity } from "@/types/hotspot";

export type WaterloggingRiskExposure = {
  distanceMeters: number;
  severity: HotspotSeverity;
  documentedEventCount: number;
};

const HOTSPOT_CORRIDOR_METERS = 75;
const RECURRENCE_REFERENCE_EVENTS = 4;

const SEVERITY_WEIGHT: Record<HotspotSeverity, number> = {
  medium: 0.7,
  high: 1.0,
};

function getProximityFactor(distanceMeters: number): number {
  return Math.max(0, 1 - distanceMeters / HOTSPOT_CORRIDOR_METERS);
}

function getRecurrenceFactor(documentedEventCount: number): number {
  const eventCount = Math.max(0, documentedEventCount);

  return Math.min(
    1,
    Math.log1p(eventCount) / Math.log1p(RECURRENCE_REFERENCE_EVENTS),
  );
}

export function calculateWaterloggingRisk(
  exposures: WaterloggingRiskExposure[],
): number {
  const totalContribution = exposures.reduce((sum, exposure) => {
    const proximityFactor = getProximityFactor(exposure.distanceMeters);
    const recurrenceFactor = getRecurrenceFactor(
      exposure.documentedEventCount,
    );
    const severityWeight = SEVERITY_WEIGHT[exposure.severity];

    return sum + severityWeight * recurrenceFactor * proximityFactor;
  }, 0);

  return 100 * (1 - Math.exp(-totalContribution));
}

export const getWaterloggingRisk = calculateWaterloggingRisk;

export { HOTSPOT_CORRIDOR_METERS, RECURRENCE_REFERENCE_EVENTS, SEVERITY_WEIGHT };
