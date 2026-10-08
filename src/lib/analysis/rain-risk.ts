import type { Route } from "@/types/route";
import type { HourlyWeather, WeatherForecast } from "@/types/weather";

export type RainMetrics = {
  totalPrecipitationMm: number;
  peakHourlyPrecipitationMm: number;
  averagePrecipitationProbability: number;
  peakPrecipitationProbability: number;
  rainRisk: number;
  intervalsUsed: number;
};

type JourneyWindow = {
  startMs: number;
  endMs: number;
};

const HOUR_MS = 60 * 60 * 1000;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function parseForecastTime(time: string): number {
  const timestamp = Date.parse(time);
  if (!Number.isFinite(timestamp)) {
    throw new Error(`Invalid forecast timestamp: ${time}`);
  }

  return timestamp;
}

function getJourneyWindow(route: Pick<Route, "durationSeconds">, departureTime: string): JourneyWindow {
  const startMs = Date.parse(departureTime);
  if (!Number.isFinite(startMs)) {
    throw new Error(`Invalid departure timestamp: ${departureTime}`);
  }

  const durationMs = Math.max(0, route.durationSeconds) * 1000;
  return { startMs, endMs: startMs + durationMs };
}

function getOverlapWeight(intervalStartMs: number, journey: JourneyWindow): number {
  const overlapStart = Math.max(intervalStartMs, journey.startMs);
  const overlapEnd = Math.min(intervalStartMs + HOUR_MS, journey.endMs);
  return clamp((overlapEnd - overlapStart) / HOUR_MS, 0, 1);
}

function validateWeatherPoint(weather: HourlyWeather): void {
  if (!Number.isFinite(weather.precipitationMm) || weather.precipitationMm < 0) {
    throw new Error(`Invalid precipitation amount for ${weather.time}.`);
  }

  if (
    !Number.isFinite(weather.precipitationProbability) ||
    weather.precipitationProbability < 0 ||
    weather.precipitationProbability > 100
  ) {
    throw new Error(`Invalid precipitation probability for ${weather.time}.`);
  }
}

export function getRainMetrics(
  route: Pick<Route, "durationSeconds">,
  forecast: Pick<WeatherForecast, "hourly">,
  departureTime: string,
): RainMetrics {
  const journey = getJourneyWindow(route, departureTime);
  let totalPrecipitationMm = 0;
  let peakHourlyPrecipitationMm = 0;
  let peakPrecipitationProbability = 0;
  let weightedProbability = 0;
  let totalWeight = 0;
  let intervalsUsed = 0;

  for (const weather of forecast.hourly) {
    validateWeatherPoint(weather);
    const intervalStartMs = parseForecastTime(weather.time);
    const weight = getOverlapWeight(intervalStartMs, journey);

    if (weight === 0) continue;

    totalPrecipitationMm += weather.precipitationMm * weight;
    peakHourlyPrecipitationMm = Math.max(
      peakHourlyPrecipitationMm,
      weather.precipitationMm,
    );
    peakPrecipitationProbability = Math.max(
      peakPrecipitationProbability,
      weather.precipitationProbability,
    );
    weightedProbability += weather.precipitationProbability * weight;
    totalWeight += weight;
    intervalsUsed += 1;
  }

  const averagePrecipitationProbability = totalWeight === 0
    ? 0
    : weightedProbability / totalWeight;
  const amountScore = clamp(totalPrecipitationMm / 15, 0, 1) * 100;
  const peakScore = clamp(peakHourlyPrecipitationMm / 6, 0, 1) * 100;
  const rainRisk = clamp(
    0.5 * amountScore +
      0.3 * peakScore +
      0.2 * averagePrecipitationProbability,
    0,
    100,
  );

  return {
    totalPrecipitationMm,
    peakHourlyPrecipitationMm,
    averagePrecipitationProbability,
    peakPrecipitationProbability,
    rainRisk,
    intervalsUsed,
  };
}

export const calculateRainRisk = getRainMetrics;
export { HOUR_MS };
