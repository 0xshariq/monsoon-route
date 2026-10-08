export type Coordinates = {
  lat: number;
  lon: number;
};

export type GeoJSONLineString = {
  type: "LineString";
  coordinates: [number, number][];
};
