"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AiState = "idle" | "loading" | "success" | "fallback" | "error";

type WhyRouteProps = {
  state?: AiState;
  explanation?: string;
  onExplain?: () => void;
};

const stateCopy: Record<AiState, { title: string; description: string }> = {
  idle: {
    title: "Why this route?",
    description: "Get a plain-language explanation after route analysis.",
  },
  loading: {
    title: "Explaining this decision...",
    description: "We are generating context from the deterministic route results.",
  },
  success: {
    title: "Why this route",
    description: "This explanation is grounded in the route analysis.",
  },
  fallback: {
    title: "Why this route",
    description: "AI is unavailable, so we are showing the deterministic explanation.",
  },
  error: {
    title: "Explanation unavailable",
    description: "The route decision is still available; try the explanation again.",
  },
};

export function WhyRoute({ state = "idle", explanation, onExplain }: WhyRouteProps) {
  const copy = stateCopy[state];
  const isLoading = state === "loading";

  return (
    <Card aria-live="polite">
      <CardHeader>
        <CardDescription>Decision context</CardDescription>
        <CardTitle>{copy.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{copy.description}</p>
        {explanation ? (
          <p className="rounded-lg border border-border bg-muted/40 p-3 text-sm leading-relaxed text-foreground">
            {explanation}
          </p>
        ) : null}
        {state === "fallback" ? (
          <p className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-foreground">
            AI explanation is currently unavailable. The deterministic route
            decision and explanation remain available.
          </p>
        ) : null}
        {state === "idle" || state === "error" ? (
          <Button type="button" variant="outline" onClick={onExplain} disabled={!onExplain}>
            {state === "error" ? "Try explanation again" : "Explain this decision"}
          </Button>
        ) : null}
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
            <span className="size-2 animate-pulse rounded-full bg-primary" aria-hidden="true" />
            Explanation loading
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default WhyRoute;
export type { AiState, WhyRouteProps };
