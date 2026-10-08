import { Agent } from "@strands-agents/sdk";
import { VercelModel } from "@strands-agents/sdk/models/vercel";
import { createOllama } from "ai-sdk-ollama";
import { z } from "zod";
import type { RouteExplanation } from "@/types/route";

export type ExplanationInput = Record<string, unknown>;

const explanationOutputSchema = z.object({
  explanation: z.string().min(1).max(1200),
});

const systemPrompt =
  "Explain the deterministic MonsoonRoute recommendation clearly and briefly. " +
  "Use only the supplied context. Never change, recalculate, or question the recommendation. " +
  "Return structured output with exactly one explanation string.";

export function createExplanationAgent(): Agent {
  return new Agent({
    model: new VercelModel({
      provider: createOllama({
        baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
      })(process.env.OLLAMA_MODEL ?? "llama3.2") as never,
    }),
    systemPrompt,
    structuredOutputSchema: explanationOutputSchema,
    printer: false,
  });
}

export async function explainRouteWithStrands(
  context: ExplanationInput,
): Promise<RouteExplanation> {
  const agent = createExplanationAgent();
  const result = await agent.invoke(JSON.stringify(context));
  const explanation =
    result.lastMessage?.content
      ?.map((block) => (block as unknown as { text?: string }).text)
      .filter((text): text is string => Boolean(text))
      .join(" ")
      .trim() ?? "";

  return { explanation } satisfies RouteExplanation;
}
