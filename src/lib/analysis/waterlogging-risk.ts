import { getHotspotDistance } from "@/lib/geo/hotspot-distance";
import type { WaterloggingHotspot } from "@/types/hotspot";
import type { Route } from "@/types/route";

export type HotspotExposure = {
  hotspot: WaterloggingHotspot;
  distanceMeters: number;
};

/**
 * Returns one exposure for each hotspot, even when a route passes a hotspot
 * multiple times or the candidate list contains duplicate records.
 */
export function getHotspotExposures(
  route: Pick<Route, "geometry">,
  hotspots: WaterloggingHotspot[],
): HotspotExposure[] {
  const exposures = new Map<string, HotspotExposure>();

  for (const hotspot of hotspots) {
    const distanceMeters = getHotspotDistance(hotspot, route);
    const existingExposure = exposures.get(hotspot.id);

    if (
      existingExposure === undefined ||
      distanceMeters < existingExposure.distanceMeters
    ) {
      exposures.set(hotspot.id, { hotspot, distanceMeters });
    }
  }

  return [...exposures.values()];
}

export const collectHotspotExposures = getHotspotExposures;
