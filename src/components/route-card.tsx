"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RouteAnalysis } from "@/types/route";

type RouteCardProps = {
  analysis: RouteAnalysis;
  fastestRouteTimeSeconds: number;
  recommendedRouteId: string;
};

function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} min`;
}

function formatDifference(seconds: number): string {
  const minutes = Math.round(seconds / 60);

  if (minutes <= 0) {
    return "Fastest route";
  }

  return `+${minutes} min vs fastest`;
}

function getRiskStatus(environmentalRisk: number) {
  if (environmentalRisk >= 90) {
    return {
      label: "High risk",
      variant: "destructive" as const,
    };
  }

  return {
    label: "Within critical threshold",
    variant: "outline" as const,
  };
}

function getRouteLabel(analysis: RouteAnalysis): string {
  return analysis.route.label === "default"
    ? "Default route"
    : "Alternative route";
}

export function RouteCard({
  analysis,
  fastestRouteTimeSeconds,
  recommendedRouteId,
}: RouteCardProps) {
  const isRecommended = analysis.route.id === recommendedRouteId;
  const isFastest = analysis.route.durationSeconds === fastestRouteTimeSeconds;
  const isSlowerThanFastest =
    analysis.route.durationSeconds > fastestRouteTimeSeconds;
  const riskStatus = getRiskStatus(analysis.environmentalRiskScore);

  return (
    <Card
      className={
        isRecommended
          ? "border-primary/60 shadow-md"
          : "border-border"
      }
    >
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardDescription>{getRouteLabel(analysis)}</CardDescription>
            <CardTitle className="mt-1 text-xl">
              {formatDuration(analysis.route.durationSeconds)}
            </CardTitle>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {isRecommended ? (
              <Badge className="bg-success text-success-foreground">
                Recommended
              </Badge>
            ) : null}

            {isFastest ? (
              <Badge variant="outline">Fastest</Badge>
            ) : null}

            {isRecommended && isSlowerThanFastest ? (
              <Badge className="border-warning bg-warning/10 text-warning">
                Slower but safer
              </Badge>
            ) : null}

            <Badge variant={riskStatus.variant}>{riskStatus.label}</Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {formatDifference(
            analysis.route.durationSeconds - fastestRouteTimeSeconds,
          )}
        </p>
      </CardHeader>

      <CardContent className="grid gap-3 sm:grid-cols-3">
        <Metric
          label="Environmental risk"
          value={analysis.environmentalRiskScore}
        />
        <Metric
          label="Waterlogging risk"
          value={analysis.waterlogging.riskScore}
        />
        <Metric label="Rain risk" value={analysis.rain.rainRisk} />
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">
        {Math.round(value)} / 100
      </p>
    </div>
  );
}

export default RouteCard;
export type { RouteCardProps };
