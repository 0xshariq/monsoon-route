"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RouteForm, { type RouteFormValues } from "@/components/route-form";
import RouteMap from "@/components/route-map";
import WhyRoute, { type AiState } from "@/components/why-route";
import RouteCard from "@/components/route-card";
import RouteAnalysisCard from "@/components/route-analysis";
import type { WaterloggingHotspot } from "@/types/hotspot";
import type { Recommendation, RouteAnalysis } from "@/types/route";

type AnalyzeResponse = {
  routes: RouteAnalysis[];
  recommendation: Recommendation;
  hotspots: WaterloggingHotspot[];
};

type RecommendationSectionProps = {
  recommendation: Recommendation;
  routes: RouteAnalysis[];
};

function formatDuration(seconds: number): string {
  return `${Math.max(1, Math.round(seconds / 60))} min`;
}

function RecommendationSection({
  recommendation,
  routes,
}: RecommendationSectionProps) {
  const recommendedRoute = routes.find(
    ({ route }) => route.id === recommendation.recommendedRouteId,
  );

  if (!recommendedRoute) {
    return null;
  }

  const fastestRoute = routes.reduce((fastest, current) =>
    current.route.durationSeconds < fastest.route.durationSeconds
      ? current
      : fastest,
  );
  const timeDifferenceMinutes = Math.max(
    0,
    Math.round(
      (recommendedRoute.route.durationSeconds -
        fastestRoute.route.durationSeconds) /
        60,
    ),
  );
  const { avoidedHighRiskHotspots } = recommendation.reason;
  const routeLabel =
    recommendedRoute.route.label === "default" ? "Route A" : "Route B";

  return (
    <Card className="border-primary/50 bg-primary/[0.04] shadow-sm">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardDescription>Recommended route</CardDescription>
            <CardTitle className="mt-1 text-2xl">{routeLabel}</CardTitle>
          </div>
          <Badge className="bg-success text-success-foreground">
            Safer option
          </Badge>
        </div>
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {formatDuration(recommendedRoute.route.durationSeconds)}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background/70 p-3">
            <p className="text-sm text-muted-foreground">Travel-time trade-off</p>
            <p className="mt-1 font-medium text-foreground">
              {timeDifferenceMinutes > 0
                ? `+${timeDifferenceMinutes} min vs fastest`
                : "Fastest route"}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background/70 p-3">
            <p className="text-sm text-muted-foreground">Waterlogging evidence</p>
            <p className="mt-1 font-medium text-foreground">
              {avoidedHighRiskHotspots > 0
                ? `${avoidedHighRiskHotspots} high-risk hotspot${
                    avoidedHighRiskHotspots === 1 ? "" : "s"
                  } avoided`
                : "No high-risk hotspots avoided"}
            </p>
          </div>
        </div>
        <Button variant="outline" className="w-fit">
          Explain this decision
        </Button>
      </CardContent>
    </Card>
  );
}

type RequestState = "idle" | "loading" | "success" | "error";

function RequestStateMessage({ state }: { state: RequestState }) {
  if (state === "idle") {
    return <p className="text-sm text-muted-foreground">Enter two locations to compare routes.</p>;
  }
  if (state === "loading") {
    return <p className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-foreground" role="status">Analyzing routes, forecast rain, and waterlogging evidence…</p>;
  }
  if (state === "error") {
    return <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive" role="alert">We could not analyze this route. Check the locations and try again.</p>;
  }
  return <p className="rounded-lg border border-success/40 bg-success/5 p-3 text-sm text-foreground" role="status">Route analysis complete.</p>;
}

export default function MonsoonRouteHome() {
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [aiState, setAiState] = useState<AiState>("idle");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [routeInput, setRouteInput] = useState<RouteFormValues | null>(null);

  async function analyzeRoute(values: RouteFormValues) {
    setRequestState("loading");
    setAiState("idle");
    setRouteInput(values);
    setAnalysis(null);
    try {
      const response = await fetch("/api/analyze-route", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Route analysis request failed");
      setAnalysis((await response.json()) as AnalyzeResponse);
      setRequestState("success");
    } catch {
      setRequestState("error");
    }
  }

  function explainRoute() {
    setAiState("loading");
    window.setTimeout(() => setAiState("fallback"), 500);
  }

  return (
    <main className="flex-1 bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            MonsoonRoute
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Choose the safer route when rain changes the road.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Compare routes using forecast rain, waterlogging evidence, and
            travel-time trade-offs.
          </p>
        </header>

        <RouteForm onSubmit={analyzeRoute} />
        <RequestStateMessage state={requestState} />

        {analysis && routeInput ? (
          <section aria-label="Route results" className="flex min-w-0 flex-col gap-6">
            <RouteMap
              origin={routeInput.origin}
              destination={routeInput.destination}
              routes={analysis.routes}
              recommendedRouteId={analysis.recommendation.recommendedRouteId}
              hotspots={analysis.hotspots}
            />
            <RecommendationSection
              recommendation={analysis.recommendation}
              routes={analysis.routes}
            />
            <div className="grid gap-6 lg:grid-cols-2">
              {analysis.routes.map((route) => (
                <div key={route.route.id} className="flex flex-col gap-4">
                  <RouteCard
                    analysis={route}
                    fastestRouteTimeSeconds={Math.min(
                      ...analysis.routes.map((item) => item.route.durationSeconds),
                    )}
                    recommendedRouteId={analysis.recommendation.recommendedRouteId}
                  />
                  <RouteAnalysisCard analysis={route} />
                </div>
              ))}
            </div>
            <WhyRoute
              state={aiState}
              explanation={
                aiState === "fallback"
                  ? "The deterministic route decision remains available while an AI explanation is unavailable."
                  : undefined
              }
              onExplain={explainRoute}
            />
          </section>
        ) : null}
      </div>
    </main>
  );
}
