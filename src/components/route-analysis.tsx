import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RouteAnalysis as RouteAnalysisData } from "@/types/route";

type RouteAnalysisProps = {
  analysis: RouteAnalysisData;
};

type RiskMetricProps = {
  label: string;
  value: number;
};

function clampRisk(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function RiskMetric({ label, value }: RiskMetricProps) {
  const roundedValue = Math.round(clampRisk(value));

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {roundedValue} / 100
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={`${label} score`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={roundedValue}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${roundedValue}%` }}
        />
      </div>
    </div>
  );
}

export function RouteAnalysis({ analysis }: RouteAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Deterministic route analysis</CardDescription>
        <CardTitle>Risk breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <RiskMetric
          label="Environmental Risk"
          value={analysis.environmentalRiskScore}
        />
        <RiskMetric
          label="Waterlogging Risk"
          value={analysis.waterlogging.riskScore}
        />
        <RiskMetric label="Rain Risk" value={analysis.rain.rainRisk} />
        <RiskMetric label="Time Penalty" value={analysis.timePenalty} />
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground">Evidence</h3>
          {analysis.evidence.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {analysis.evidence.map((item, index) => (
                <li key={`${item.type}-${index}`}>{item.message}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No supporting evidence was returned for this route.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RouteAnalysis;
export type { RouteAnalysisProps };
