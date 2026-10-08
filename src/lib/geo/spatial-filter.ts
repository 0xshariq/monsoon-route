import type { WaterloggingHotspot } from "@/types/hotspot";
import type { GeoJSONLineString } from "@/types/route";

type GeoJSONCoordinate = [number, number];

type BoundingBox = {
  minLongitude: number;
  minLatitude: number;
  maxLongitude: number;
  maxLatitude: number;
};

const EARTH_RADIUS_METERS = 6_371_000;
const ROUTE_RELEVANCE_METERS = 75;

function toBoundingBox(coordinates: GeoJSONCoordinate[]): BoundingBox {
  return coordinates.reduce<BoundingBox>(
    (box, [longitude, latitude]) => ({
      minLongitude: Math.min(box.minLongitude, longitude),
      minLatitude: Math.min(box.minLatitude, latitude),
      maxLongitude: Math.max(box.maxLongitude, longitude),
      maxLatitude: Math.max(box.maxLatitude, latitude),
    }),
    {
      minLongitude: Number.POSITIVE_INFINITY,
      minLatitude: Number.POSITIVE_INFINITY,
      maxLongitude: Number.NEGATIVE_INFINITY,
      maxLatitude: Number.NEGATIVE_INFINITY,
    },
  );
}

function metersToLatitudeDegrees(meters: number): number {
  return (meters / EARTH_RADIUS_METERS) * (180 / Math.PI);
}

function metersToLongitudeDegrees(meters: number, latitude: number): number {
  const latitudeRadians = (latitude * Math.PI) / 180;
  const metersPerDegree = EARTH_RADIUS_METERS * Math.cos(latitudeRadians) * (Math.PI / 180);

  return meters / Math.max(metersPerDegree, Number.EPSILON);
}

function expandBoundingBox(box: BoundingBox, bufferMeters: number): BoundingBox {
  const midpointLatitude = (box.minLatitude + box.maxLatitude) / 2;
  const latitudeBuffer = metersToLatitudeDegrees(bufferMeters);
  const longitudeBuffer = metersToLongitudeDegrees(bufferMeters, midpointLatitude);

  return {
    minLongitude: box.minLongitude - longitudeBuffer,
    minLatitude: box.minLatitude - latitudeBuffer,
    maxLongitude: box.maxLongitude + longitudeBuffer,
    maxLatitude: box.maxLatitude + latitudeBuffer,
  };
}

function boundingBoxesOverlap(first: BoundingBox, second: BoundingBox): boolean {
  return (
    first.minLongitude <= second.maxLongitude &&
    first.maxLongitude >= second.minLongitude &&
    first.minLatitude <= second.maxLatitude &&
    first.maxLatitude >= second.minLatitude
  );
}

function hotspotBoundingBox(hotspot: WaterloggingHotspot): BoundingBox {
  if (hotspot.geometry.type === "Point") {
    const [longitude, latitude] = hotspot.geometry.coordinates;
    return {
      minLongitude: longitude,
      minLatitude: latitude,
      maxLongitude: longitude,
      maxLatitude: latitude,
    };
  }

  return toBoundingBox(hotspot.geometry.coordinates.flat());
}

/**
 * Returns every hotspot whose geometry could be within the route relevance
 * radius. This is deliberately a conservative bbox prefilter; exact distance
 * and intersection checks happen in later stages.
 */
export function filterHotspotsByRoute(
  routeGeometry: GeoJSONLineString,
  hotspots: WaterloggingHotspot[],
  bufferMeters = ROUTE_RELEVANCE_METERS,
): WaterloggingHotspot[] {
  if (routeGeometry.coordinates.length === 0 || hotspots.length === 0) {
    return [];
  }

  const routeBox = expandBoundingBox(toBoundingBox(routeGeometry.coordinates), bufferMeters);

  return hotspots.filter((hotspot) => boundingBoxesOverlap(routeBox, hotspotBoundingBox(hotspot)));
}

export { ROUTE_RELEVANCE_METERS };

export type { BoundingBox };

export function getHotspotBoundingBox(hotspot: WaterloggingHotspot): BoundingBox {
  return hotspotBoundingBox(hotspot);
}

export function getRouteBoundingBox(
  routeGeometry: GeoJSONLineString,
  bufferMeters = ROUTE_RELEVANCE_METERS,
): BoundingBox {
  return expandBoundingBox(toBoundingBox(routeGeometry.coordinates), bufferMeters);
}
