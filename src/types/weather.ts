import type { Coordinates } from "./route";

export type WeatherLocation = Coordinates;

export type HourlyWeather = {
  time: string;
  precipitationMm: number;
  precipitationProbability: number;
};

export type WeatherForecast = {
  location: WeatherLocation;
  hourly: HourlyWeather[];
};
