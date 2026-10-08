import { Agent } from "@strands-agents/sdk";
import { VercelModel } from "@strands-agents/sdk/models/vercel";
import { createOllama } from "ai-sdk-ollama";
import { NextResponse } from "next/server";
import { z } from "zod";
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

function createExplanationAgent(): Agent {
  return new Agent({
    model: new VercelModel({
      provider: createOllama({
        baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/api",
      })("llama3.2") as never,
    }),
    systemPrompt:
      "Explain the deterministic MonsoonRoute recommendation clearly and briefly. " +
      "Do not recalculate or change the recommendation. Return only plain text.",
    printer: false,
  });
}

export async function POST(request: Request) {
  try {
    const context = explanationContextSchema.parse(await request.json());
    const result = await createExplanationAgent().invoke(JSON.stringify(context));
    const explanation = result.lastMessage?.content
      .map((block) => (block as unknown as { text?: string }).text)
      .filter((text): text is string => Boolean(text))
      .join(" ")
      .trim();

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

    return NextResponse.json(
      { error: "The explanation service is unavailable." },
      { status: 503 },
    );
  }
}
