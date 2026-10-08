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

export type RecommendationStatus =
  | "safer_option_found"
  | "lowest_risk_available";

export type RecommendationReason = {
  timeDifferenceMinutes: number;
  environmentalRiskDifference: number;
  waterloggingRiskDifference: number;
  avoidedHighRiskHotspots: number;
  decisionScoreDifference: number;
};

export type Recommendation = {
  recommendedRouteId: string;
  status: RecommendationStatus;
  reason: RecommendationReason;
};