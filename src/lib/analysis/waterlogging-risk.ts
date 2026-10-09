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
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    throw new Error("Waterlogging distance must be finite and non-negative.");
  }
  return Math.max(0, 1 - distanceMeters / HOTSPOT_CORRIDOR_METERS);
}

function getRecurrenceFactor(documentedEventCount: number): number {
  if (!Number.isFinite(documentedEventCount) || documentedEventCount < 0 || !Number.isInteger(documentedEventCount)) {
    throw new Error("Documented waterlogging events must be a finite non-negative integer.");
  }
  const eventCount = documentedEventCount;

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
    if (!Number.isFinite(severityWeight)) {
      throw new Error("Waterlogging severity is invalid.");
    }

    return sum + severityWeight * recurrenceFactor * proximityFactor;
  }, 0);

  return 100 * (1 - Math.exp(-totalContribution));
}

export const getWaterloggingRisk = calculateWaterloggingRisk;

export { HOTSPOT_CORRIDOR_METERS, RECURRENCE_REFERENCE_EVENTS, SEVERITY_WEIGHT };
