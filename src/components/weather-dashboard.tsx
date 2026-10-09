"use client";

import { useEffect, useState } from "react";
import { CloudRain, Loader2 } from "lucide-react";
import { Metric, Panel } from "@/components/app-shell";

type WeatherData = { current: { temperature_2m: number; relative_humidity_2m: number; apparent_temperature: number; precipitation: number; weather_code: number; wind_speed_10m: number; visibility: number }; hourly: { time: string[]; temperature_2m: number[]; precipitation_probability: number[]; weather_code: number[] } };

function label(code: number) { return code >= 51 ? "Rain likely" : code >= 1 ? "Partly cloudy" : "Clear skies"; }
function formatHour(value: string) { return new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: true, timeZone: "Asia/Kolkata" }).format(new Date(value)); }

export function WeatherDashboard() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { fetch("/api/weather").then((response) => response.ok ? response.json() : Promise.reject()).then(setData).catch(() => setError(true)); }, []);

  if (error) return <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">Live weather is temporarily unavailable. Please refresh in a moment.</div>;
  if (!data) return <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b202d] p-5 text-sm text-slate-400" role="status"><Loader2 className="animate-spin" /> Loading live Mumbai weather...</div>;

  const current = data.current;
  const start = Math.max(0, data.hourly.time.findIndex((time) => new Date(time) >= new Date()));
  const hours = data.hourly.time.slice(start, start + 8);
  return <Panel className="p-5"><div className="grid gap-6 md:grid-cols-[1fr_1.5fr]"><div className="flex items-center gap-5"><CloudRain className="size-16 text-[#269fff]" /><div><p className="text-5xl font-semibold">{Math.round(current.temperature_2m)}°C</p><p className="text-sm text-slate-400">{label(current.weather_code)} · Feels like {Math.round(current.apparent_temperature)}°C</p></div></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric label="Rain now" value={`${current.precipitation} mm`} /><Metric label="Humidity" value={`${current.relative_humidity_2m}%`} /><Metric label="Wind" value={`${Math.round(current.wind_speed_10m)} km/h`} /><Metric label="Visibility" value={`${Math.round(current.visibility / 1000)} km`} /></div></div><div className="mt-6 grid grid-cols-4 gap-2 border-t border-white/10 pt-5 sm:grid-cols-8">{hours.map((time, index) => <div key={time} className="rounded-xl bg-[#091923] p-3 text-center"><p className="text-[11px] text-slate-500">{index === 0 ? "Now" : formatHour(time)}</p><CloudRain className="mx-auto my-3 size-5 text-[#269fff]" /><p className="text-sm font-medium">{Math.round(data.hourly.temperature_2m[start + index])}°</p><p className="mt-1 text-[10px] text-slate-500">{data.hourly.precipitation_probability[start + index]}% rain</p></div>)}</div><p className="mt-4 text-xs text-slate-500">Live data from Open-Meteo · refreshed every 30 minutes</p></Panel>;
}
