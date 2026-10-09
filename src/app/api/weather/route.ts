import { NextResponse } from "next/server";

export const revalidate = 1800;

export async function GET() {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", "19.076");
  url.searchParams.set("longitude", "72.8777");
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,visibility");
  url.searchParams.set("hourly", "temperature_2m,precipitation_probability,weather_code");
  url.searchParams.set("forecast_days", "2");
  url.searchParams.set("timezone", "Asia/Kolkata");

  const response = await fetch(url, { next: { revalidate: 1800 } });
  if (!response.ok) return NextResponse.json({ error: "Weather provider unavailable" }, { status: 502 });
  return NextResponse.json(await response.json());
}
