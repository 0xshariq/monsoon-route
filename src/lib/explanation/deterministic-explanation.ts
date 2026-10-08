import type {
  Recommendation,
  RouteAnalysis,
} from "@/types/route";

type DeterministicExplanationInput = {
  recommendation: Recommendation;
  analyses: RouteAnalysis[];
};

function routeLabel(analysis: RouteAnalysis): string {
  return analysis.route.label === "default" ? "Route A" : "Route B";
}

function formatMinutes(minutes: number): string {
  return `${Math.abs(Math.round(minutes))} minute${Math.abs(Math.round(minutes)) === 1 ? "" : "s"}`;
}

export function createDeterministicExplanation({
  recommendation,
  analyses,
}: DeterministicExplanationInput): string {
  const recommended = analyses.find(
    (analysis) => analysis.route.id === recommendation.recommendedRouteId,
  );

  if (!recommended) {
    return "No route recommendation is available yet. Analyze a route to see the decision context.";
  }

  const fastest = analyses.reduce((current, analysis) =>
    analysis.route.durationSeconds < current.route.durationSeconds
      ? analysis
      : current,
  );
  const label = routeLabel(recommended);
  const timeDifferenceMinutes = Math.round(
    (recommended.route.durationSeconds - fastest.route.durationSeconds) / 60,
  );
  const reasons: string[] = [];

  if (recommended.waterlogging.riskScore < fastest.waterlogging.riskScore) {
    reasons.push("lower waterlogging exposure");
  }
  if (recommended.rain.rainRisk < fastest.rain.rainRisk) {
    reasons.push("lower forecast rain risk");
  }
  if (recommended.environmentalRiskScore < fastest.environmentalRiskScore) {
    reasons.push("a lower environmental-risk score");
  }

  const reasonText = reasons.length
    ? reasons.length === 1
      ? reasons[0]
      : `${reasons.slice(0, -1).join(", ")}, and ${reasons.at(-1)}`
    : "the lowest available decision score";

  if (timeDifferenceMinutes > 0) {
    return `${label} is recommended even though it is ${formatMinutes(
      timeDifferenceMinutes,
    )} slower than the fastest route. It offers ${reasonText}.`;
  }

  if (recommended.route.id === fastest.route.id) {
    return `${label} is recommended as the fastest available route with ${reasonText}.`;
  }

  return `${label} is recommended because it offers ${reasonText}.`;
}

export const deterministicExplanation = createDeterministicExplanation;

export function getExplanationAfterAiFailure(
  input: DeterministicExplanationInput,
): { state: "fallback"; explanation: string } {
  return {
    state: "fallback",
    explanation: createDeterministicExplanation(input),
  };
}
