import booleanIntersects from "@turf/boolean-intersects";
import lineIntersect from "@turf/line-intersect";
import lineSegment from "@turf/line-segment";
import pointToLineDistance from "@turf/point-to-line-distance";
import pointToPolygonDistance from "@turf/point-to-polygon-distance";
import { lineString, point, polygon } from "@turf/helpers";
import type { WaterloggingHotspot } from "@/types/hotspot";
import type { GeoJSONLineString, Route } from "@/types/route";

type PointHotspot = Pick<WaterloggingHotspot, "id" | "geometry"> & {
  geometry: Extract<WaterloggingHotspot["geometry"], { type: "Point" }>;
};

type PolygonHotspot = Pick<WaterloggingHotspot, "id" | "geometry"> & {
  geometry: Extract<WaterloggingHotspot["geometry"], { type: "Polygon" }>;
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

function asPolygon(hotspot: PolygonHotspot) {
  if (hotspot.geometry.coordinates.length === 0) {
    throw new Error("Polygon hotspot must contain at least one ring.");
  }

  return polygon(hotspot.geometry.coordinates);
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

export function getPolygonHotspotDistance(
  hotspot: PolygonHotspot,
  route: Pick<Route, "geometry">,
): number {
  const routeLine = asRouteLine(route.geometry);
  const hotspotPolygon = asPolygon(hotspot);

  if (booleanIntersects(routeLine, hotspotPolygon)) {
    return 0;
  }

  const boundary = lineString(hotspot.geometry.coordinates[0]);
  const routeVertices = route.geometry.coordinates.map((coordinate) =>
    point(coordinate),
  );
  const boundaryVertices = hotspot.geometry.coordinates[0].map((coordinate) =>
    point(coordinate),
  );
  const boundarySegments = lineSegment(boundary).features;
  const routeSegments = lineSegment(routeLine).features;

  const hasIntersection = routeSegments.some((routeSegment) =>
    boundarySegments.some((boundarySegment) =>
      lineIntersect(routeSegment, boundarySegment).features.length > 0,
    ),
  );

  if (hasIntersection) {
    return 0;
  }

  const distances = [
    ...routeVertices.map((vertex) =>
      pointToPolygonDistance(vertex, hotspotPolygon, { units: "meters" }),
    ),
    ...routeVertices.flatMap((vertex) =>
      boundarySegments.map((segment) =>
        pointToLineDistance(vertex, segment, { units: "meters" }),
      ),
    ),
    ...boundaryVertices.map((vertex) =>
      pointToLineDistance(vertex, routeLine, { units: "meters" }),
    ),
  ];

  return Math.min(...distances);
}

export function getHotspotDistance(
  hotspot: Pick<WaterloggingHotspot, "geometry">,
  route: Pick<Route, "geometry">,
): number {
  if (hotspot.geometry.type === "Point") {
    return getPointHotspotDistance(hotspot as PointHotspot, route);
  }

  return getPolygonHotspotDistance(hotspot as PolygonHotspot, route);
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
export const polygonHotspotDistance = getPolygonHotspotDistance;
export const hotspotDistance = getHotspotDistance;
