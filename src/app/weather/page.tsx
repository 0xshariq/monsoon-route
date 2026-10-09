import { AppShell, PageFrame } from "@/components/app-shell";
import { WeatherDashboard } from "@/components/weather-dashboard";

export default function WeatherPage() {
  return <AppShell><PageFrame eyebrow="Forecast" title="Mumbai, Maharashtra" description="Current conditions and hourly forecast from live weather data."><WeatherDashboard /></PageFrame></AppShell>;
}
