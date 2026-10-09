import type { Coordinates, Route } from "@/types/route";
import { fetchWithTimeout } from "@/lib/providers/request-timeout";
import { getRouteMidpoints } from "@/lib/geo/route-geometry";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const HOURLY_FIELDS = "precipitation,precipitation_probability,weather_code";
const TIMEZONE = "Asia/Kolkata";

export type WeatherInterval = {
  time: string;
  intervalStart: string;
  intervalEnd: string;
  precipitationMm: number;
  precipitationProbability: number;
  weatherCode: number;
};

export type WeatherSnapshot = {
  routeId: string;
  location: Coordinates;
  hourly: WeatherInterval[];
};

type OpenMeteoLocationResponse = {
  latitude?: number;
  longitude?: number;
  hourly?: {
    time?: unknown;
    precipitation?: unknown;
    precipitation_probability?: unknown;
    weather_code?: unknown;
  };
};

type OpenMeteoResponse = OpenMeteoLocationResponse | OpenMeteoLocationResponse[];

function asFiniteNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Open-Meteo returned an invalid ${field}.`);
  }
  return value;
}

function asNonNegativeNumber(value: unknown, field: string): number {
  const number = asFiniteNumber(value, field);
  if (number < 0) throw new Error(`Open-Meteo returned an invalid ${field}.`);
  return number;
}

function asProbability(value: unknown): number {
  const probability = asFiniteNumber(value, "precipitation probability");
  if (probability < 0 || probability > 100) {
    throw new Error("Open-Meteo returned an invalid precipitation probability.");
  }
  return probability;
}

function asStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error(`Open-Meteo returned an invalid ${field}.`);
  }
  return value;
}

function asNumberArray(value: unknown, field: string): number[] {
  if (!Array.isArray(value)) {
    throw new Error(`Open-Meteo returned an invalid ${field}.`);
  }
  return value.map((item) => asFiniteNumber(item, field));
}

function normalizeLocations(payload: OpenMeteoResponse): OpenMeteoLocationResponse[] {
  return Array.isArray(payload) ? payload : [payload];
}

function toIntervals(hourly: NonNullable<OpenMeteoLocationResponse["hourly"]>): WeatherInterval[] {
  const times = asStringArray(hourly.time, "hourly time");
  const precipitation = asNumberArray(hourly.precipitation, "precipitation").map((value) => asNonNegativeNumber(value, "precipitation"));
  const probability = asNumberArray(
    hourly.precipitation_probability,
    "precipitation probability",
  ).map(asProbability);
  const weatherCode = asNumberArray(hourly.weather_code, "weather code").map((value) => {
    if (!Number.isInteger(value) || value < 0) throw new Error("Open-Meteo returned an invalid weather code.");
    return value;
  });

  if (
    times.length !== precipitation.length ||
    times.length !== probability.length ||
    times.length !== weatherCode.length
  ) {
    throw new Error("Open-Meteo returned mismatched hourly forecast lengths.");
  }

  return times.map((time, index) => {
    const timestamp = new Date(time);
    if (Number.isNaN(timestamp.getTime())) {
      throw new Error("Open-Meteo returned an invalid hourly timestamp.");
    }

    const intervalEnd = timestamp.toISOString();
    const intervalStart = new Date(timestamp.getTime() - 60 * 60 * 1000).toISOString();

    return {
      time: intervalEnd,
      intervalStart,
      intervalEnd,
      precipitationMm: precipitation[index],
      precipitationProbability: probability[index],
      weatherCode: weatherCode[index],
    };
  });
}

function buildUrl(routes: Route[]): URL {
  const midpoints = getRouteMidpoints(routes);
  const url = new URL(OPEN_METEO_URL);
  url.searchParams.set("latitude", midpoints.map(({ lat }) => lat).join(","));
  url.searchParams.set("longitude", midpoints.map(({ lon }) => lon).join(","));
  url.searchParams.set("hourly", HOURLY_FIELDS);
  url.searchParams.set("timezone", TIMEZONE);
  return url;
}

export async function getOpenMeteoForecast(routes: Route[]): Promise<WeatherSnapshot[]> {
  if (routes.length === 0) {
    return [];
  }

  const response = await fetchWithTimeout(buildUrl(routes), { method: "GET" }, 10000);
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Open-Meteo request failed with status ${response.status}: ${detail.slice(0, 300)}`,
    );
  }

  const payload = (await response.json()) as OpenMeteoResponse;
  const locations = normalizeLocations(payload);
  if (locations.length !== routes.length) {
    throw new Error("Open-Meteo returned a different number of locations than requested.");
  }

  return routes.map((route, index) => {
    const location = locations[index];
    const latitude = asFiniteNumber(location.latitude, "latitude");
    const longitude = asFiniteNumber(location.longitude, "longitude");

    return {
      routeId: route.id,
      location: { lat: latitude, lon: longitude },
      hourly: toIntervals(location.hourly ?? {}),
    };
  });
}

export const fetchOpenMeteoForecast = getOpenMeteoForecast;
