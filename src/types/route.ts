export type Coordinates = {
  lat: number;
  lon: number;
};

export type GeoJSONLineString = {
  type: "LineString";
  coordinates: [number, number][];
};

export type TravelMode = "DRIVE" | "TWO_WHEELER";

export type RouteRequest = {
  origin: Coordinates;
  destination: Coordinates;
  travelMode: TravelMode;
  departureTime: string;
};

export type Route = {
  id: string;
  label: "default" | "alternative";
  durationSeconds: number;
  distanceMeters: number;
  geometry: GeoJSONLineString;
};
