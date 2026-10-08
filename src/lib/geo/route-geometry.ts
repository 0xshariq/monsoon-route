import along from "@turf/along";
import { lineString } from "@turf/helpers";
import type { Coordinates, GeoJSONLineString, Route } from "@/types/route";

const EARTH_RADIUS_KILOMETERS = 6371.0088;

type TurfLineString = ReturnType<typeof lineString>;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function segmentDistanceKilometers(
  start: [number, number],
  end: [number, number],
): number {
  const [startLon, startLat] = start;
  const [endLon, endLat] = end;
  const latitudeDelta = toRadians(endLat - startLat);
  const longitudeDelta = toRadians(endLon - startLon);
  const startLatitude = toRadians(startLat);
  const endLatitude = toRadians(endLat);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_KILOMETERS * Math.asin(Math.sqrt(haversine));
}

function routeLengthKilometers(geometry: GeoJSONLineString): number {
  return geometry.coordinates.slice(1).reduce((total, coordinate, index) => {
    return total + segmentDistanceKilometers(geometry.coordinates[index], coordinate);
  }, 0);
}

function asTurfLineString(geometry: GeoJSONLineString): TurfLineString {
  if (geometry.coordinates.length < 2) {
    throw new Error("Route geometry must contain at least two coordinates.");
  }

  return lineString(geometry.coordinates);
}

export function getRouteMidpoint(route: Pick<Route, "geometry">): Coordinates {
  const line = asTurfLineString(route.geometry);
  const midpoint = along(line, routeLengthKilometers(route.geometry) / 2, {
    units: "kilometers",
  });
  const [lon, lat] = midpoint.geometry.coordinates;

  if (
    typeof lon !== "number" ||
    !Number.isFinite(lon) ||
    typeof lat !== "number" ||
    !Number.isFinite(lat)
  ) {
    throw new Error("Route midpoint geometry is invalid.");
  }

  return { lat, lon };
}

export function getRouteMidpoints(
  routes: Pick<Route, "geometry">[],
): Coordinates[] {
  return routes.map(getRouteMidpoint);
}

export const routeMidpoint = getRouteMidpoint;
export const routeMidpoints = getRouteMidpoints;
