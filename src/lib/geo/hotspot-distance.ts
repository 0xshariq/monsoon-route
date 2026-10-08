import pointToLineDistance from "@turf/point-to-line-distance";
import { lineString, point } from "@turf/helpers";
import type { WaterloggingHotspot } from "@/types/hotspot";
import type { GeoJSONLineString, Route } from "@/types/route";

type PointHotspot = Pick<WaterloggingHotspot, "id" | "geometry"> & {
  geometry: Extract<WaterloggingHotspot["geometry"], { type: "Point" }>;
};

function asRouteLine(geometry: GeoJSONLineString) {
  if (geometry.coordinates.length < 2) {
    throw new Error("Route geometry must contain at least two coordinates.");
  }

  return lineString(geometry.coordinates);
}

function assertCoordinate(coordinate: [number, number], label: string): void {
  if (
    coordinate.length !== 2 ||
    coordinate.some((value) => typeof value !== "number" || !Number.isFinite(value))
  ) {
    throw new Error(`${label} coordinates are invalid.`);
  }
}

export function getPointHotspotDistance(
  hotspot: PointHotspot,
  route: Pick<Route, "geometry">,
): number {
  const hotspotCoordinates = hotspot.geometry.coordinates;
  assertCoordinate(hotspotCoordinates, "Hotspot");

  const routeLine = asRouteLine(route.geometry);
  return pointToLineDistance(point(hotspotCoordinates), routeLine, {
    units: "meters",
  });
}

export function getPointHotspotDistances(
  hotspots: PointHotspot[],
  route: Pick<Route, "geometry">,
): { hotspotId: string; distanceMeters: number }[] {
  return hotspots.map((hotspot) => ({
    hotspotId: hotspot.id,
    distanceMeters: getPointHotspotDistance(hotspot, route),
  }));
}

export const pointHotspotDistance = getPointHotspotDistance;
export const pointHotspotDistances = getPointHotspotDistances;
