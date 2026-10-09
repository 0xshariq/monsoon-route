"use client";

import { useCallback, useRef, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { RouteForm, type RouteFormValues } from "@/components/route-form";
import { RouteMap } from "@/components/route-map";
import { RouteCard } from "@/components/route-card";
import { RouteAnalysis } from "@/components/route-analysis";
import { WhyRoute, type AiState } from "@/components/why-route";
import { Button } from "@/components/ui/button";
import { createDeterministicExplanation } from "@/lib/explanation/deterministic-explanation";
import type { ExplanationContext, RouteAnalysis as RouteAnalysisData, Recommendation } from "@/types/route";
import type { WaterloggingHotspot } from "@/types/hotspot";

type AnalyzeResponse = {
  routes: RouteAnalysisData[];
  recommendation: Recommendation;
  hotspots: WaterloggingHotspot[];
  origin: RouteFormValues["origin"];
  destination: RouteFormValues["destination"];
};

type ErrorResponse = { error?: { message?: string } };

function buildExplanationContext(result: AnalyzeResponse): ExplanationContext {
  const recommended = result.routes.find((route) => route.route.id === result.recommendation.recommendedRouteId) ?? result.routes[0];
  const fastest = result.routes.reduce((current, route) => route.route.durationSeconds < current.route.durationSeconds ? route : current);
  const summary = (route: RouteAnalysisData) => ({
    durationMinutes: route.route.durationSeconds / 60,
    environmentalRiskScore: route.environmentalRiskScore,
    waterloggingRiskScore: route.waterlogging.riskScore,
    rainRiskScore: route.rain.rainRisk,
  });

  return {
    recommendation: result.recommendation,
    recommendedRoute: { ...summary(recommended), evidence: recommended.evidence },
    fastestRoute: summary(fastest),
  };
}

export function RouteAnalyzer() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiState, setAiState] = useState<AiState>("idle");
  const [explanation, setExplanation] = useState<string>();
  const analysisRequest = useRef<AbortController | null>(null);
  const explanationRequest = useRef<AbortController | null>(null);

  const analyze = useCallback(async (values: RouteFormValues) => {
    analysisRequest.current?.abort();
    explanationRequest.current?.abort();
    const controller = new AbortController();
    analysisRequest.current = controller;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setExplanation(undefined);
    setAiState("idle");
    try {
      const response = await fetch("/api/analyze-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: controller.signal,
      });
      const payload = (await response.json()) as AnalyzeResponse & ErrorResponse;
      if (!response.ok || !payload.routes) throw new Error(payload.error?.message ?? "Route analysis failed.");
      if (controller.signal.aborted) return;
      setResult({ ...payload, origin: values.origin, destination: values.destination });
    } catch (cause) {
      if (controller.signal.aborted) return;
      setError(cause instanceof Error ? cause.message : "Route analysis failed. Please try again.");
    } finally {
      if (!controller.signal.aborted) setIsAnalyzing(false);
    }
  }, []);

  const explain = useCallback(async () => {
    if (!result) return;
    explanationRequest.current?.abort();
    const controller = new AbortController();
    explanationRequest.current = controller;
    setAiState("loading");
    try {
      const response = await fetch("/api/explain-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildExplanationContext(result)),
        signal: controller.signal,
      });
      const payload = (await response.json()) as { explanation?: string };
      if (!response.ok || !payload.explanation) throw new Error("Explanation unavailable");
      if (controller.signal.aborted) return;
      setExplanation(payload.explanation);
      setAiState("success");
    } catch {
      if (controller.signal.aborted) return;
      setExplanation(createDeterministicExplanation({ recommendation: result.recommendation, analyses: result.routes }));
      setAiState("fallback");
    }
  }, [result]);

  const fastestTime = result ? Math.min(...result.routes.map((route) => route.route.durationSeconds)) : 0;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  if (!apiKey) {
    return <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">Google Maps is not configured for this environment. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable location selection and route maps.</div>;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["places", "marker"]}>
      <div className="flex flex-col gap-6">
      <RouteForm onSubmit={analyze} />
      {isAnalyzing ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground" role="status">
          <Loader2 className="animate-spin" data-icon="inline-start" /> Analyzing routes, rain, and waterlogging evidence...
        </div>
      ) : null}
      {error ? (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle data-icon="inline-start" />
          <div className="flex flex-1 flex-col gap-3"><strong>Route analysis failed</strong><span>{error}</span><Button type="button" variant="outline" onClick={() => setError(null)}>Dismiss</Button></div>
        </div>
      ) : null}
      {result ? (
        <div className="flex flex-col gap-6">
          <RouteMap origin={result.origin} destination={result.destination} routes={result.routes} recommendedRouteId={result.recommendation.recommendedRouteId} hotspots={result.hotspots} />
          <section aria-labelledby="routes-heading" className="flex flex-col gap-3"><h2 id="routes-heading" className="text-xl font-semibold">Route comparison</h2>{result.routes.map((route) => <RouteCard key={route.route.id} analysis={route} fastestRouteTimeSeconds={fastestTime} recommendedRouteId={result.recommendation.recommendedRouteId} />)}</section>
          <RouteAnalysis analysis={result.routes.find((route) => route.route.id === result.recommendation.recommendedRouteId) ?? result.routes[0]} />
          <WhyRoute state={aiState} explanation={explanation} onExplain={explain} />
        </div>
      ) : null}
      </div>
    </APIProvider>
  );
}

export default RouteAnalyzer;
