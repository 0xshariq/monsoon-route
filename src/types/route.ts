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

export type EvidenceType = "waterlogging" | "rain" | "travel-time";

export type RecommendationEvidence = {
  type: EvidenceType;
  message: string;
};

export type WaterloggingAnalysis = {
  riskScore: number;
  exposedHotspots: number;
  highRiskHotspotCount: number;
};

export type RainAnalysis = {
  totalPrecipitationMm: number;
  peakHourlyPrecipitationMm: number;
  averagePrecipitationProbability: number;
  peakPrecipitationProbability: number;
  rainRisk: number;
  intervalsUsed: number;
};

export type AnalysisEvidence = RecommendationEvidence;

export type RouteAnalysis = {
  route: Route;
  waterlogging: WaterloggingAnalysis;
  rain: RainAnalysis;
  environmentalRiskScore: number;
  timePenalty: number;
  decisionScore: number;
  evidence: AnalysisEvidence[];
};
