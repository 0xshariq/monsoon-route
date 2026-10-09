import { NextResponse } from "next/server";
import { z } from "zod";
import { explainRouteWithStrands } from "@/lib/providers/strands";
import type { ExplanationContext } from "@/types/route";

export const runtime = "nodejs";

const evidenceSchema = z.object({
  type: z.enum(["waterlogging", "rain", "travel-time"]),
  message: z.string().min(1).max(500),
});

const routeSummarySchema = z.object({
  durationMinutes: z.number().finite().nonnegative(),
  environmentalRiskScore: z.number().finite().min(0).max(100),
  waterloggingRiskScore: z.number().finite().min(0).max(100),
  rainRiskScore: z.number().finite().min(0).max(100),
  evidence: z.array(evidenceSchema).max(20).optional(),
});

const explanationContextSchema = z.object({
  recommendation: z.object({
    recommendedRouteId: z.string().min(1),
    status: z.enum(["safer_option_found", "lowest_risk_available"]),
    reason: z.object({
      timeDifferenceMinutes: z.number().finite(),
      environmentalRiskDifference: z.number().finite(),
      waterloggingRiskDifference: z.number().finite(),
      avoidedHighRiskHotspots: z.number().int().nonnegative(),
      decisionScoreDifference: z.number().finite(),
    }),
  }),
  recommendedRoute: routeSummarySchema.extend({ evidence: z.array(evidenceSchema).max(20) }),
  fastestRoute: routeSummarySchema,
}) satisfies z.ZodType<ExplanationContext>;

function deterministicFallback(context: ExplanationContext): string {
  const recommended = context.recommendedRoute;
  const fastest = context.fastestRoute;
  const timeDifference = Math.round(recommended.durationMinutes - fastest.durationMinutes);
  const reason = recommended.environmentalRiskScore < fastest.environmentalRiskScore
    ? "lower environmental risk"
    : "the lowest available decision score";
  return timeDifference > 0
    ? `The recommended route prioritizes ${reason} and is about ${timeDifference} minutes slower than the fastest route.`
    : `The recommended route is selected for ${reason}.`;
}

export async function POST(request: Request) {
  let parsedContext: ExplanationContext | null = null;

  try {
    parsedContext = explanationContextSchema.parse(await request.json());
    const context = parsedContext;
    const result = await Promise.race([
      explainRouteWithStrands(context),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Explanation timed out.")), 15000),
      ),
    ]);
    const explanation = result.explanation.trim();

    if (!explanation) {
      return NextResponse.json(
        { error: "The explanation service returned no explanation." },
        { status: 502 },
      );
    }

    return NextResponse.json({ explanation });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid explanation context." },
        { status: 400 },
      );
    }

    if (parsedContext) {
      return NextResponse.json({
        explanation: deterministicFallback(parsedContext),
        state: "fallback",
      });
    }

    return NextResponse.json(
      { error: "The explanation service is unavailable." },
      { status: 503 },
    );
  }
}
