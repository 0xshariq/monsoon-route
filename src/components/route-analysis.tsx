import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RouteAnalysis as RouteAnalysisData } from "@/types/route";

type RouteAnalysisProps = {
  analysis: RouteAnalysisData;
};

function formatScore(value: number): string {
  return `${Math.round(value)} / 100`;
}

function formatMinutes(seconds: number): string {
  return `${Math.max(0, Math.round(seconds / 60))} min`;
}

export function RouteAnalysis({ analysis }: RouteAnalysisProps) {
  const metrics = [
    {
      label: "Environmental Risk",
      value: formatScore(analysis.environmentalRiskScore),
    },
    {
      label: "Waterlogging Risk",
      value: formatScore(analysis.waterlogging.riskScore),
    },
    {
      label: "Rain Risk",
      value: formatScore(analysis.rain.rainRisk),
    },
    {
      label: "Time Penalty",
      value: formatMinutes(analysis.timePenalty),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Deterministic analysis for {analysis.route.label === "default" ? "the default route" : "the alternative route"}
        </CardDescription>
        <CardTitle>Route analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-border bg-muted/30 p-4"
            >
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        <section aria-labelledby="route-analysis-evidence">
          <h3
            id="route-analysis-evidence"
            className="text-sm font-semibold text-foreground"
          >
            Evidence
          </h3>
          {analysis.evidence.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {analysis.evidence.map((evidence, index) => (
                <li
                  key={`${evidence.type}-${index}`}
                  className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground"
                >
                  {evidence.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No supporting evidence is available for this route.
            </p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}

export default RouteAnalysis;
export type { RouteAnalysisProps };
