import { Agent } from "@strands-agents/sdk";
import { VercelModel } from "@strands-agents/sdk/models/vercel";
import { createOllama } from "ai-sdk-ollama";
import { z } from "zod";

export type ExplanationInput = Record<string, unknown>;

const explanationOutputSchema = z.object({
  explanation: z.string().min(1).max(1200),
});

const systemPrompt = [
  "You explain an already-computed MonsoonRoute recommendation.",
  "Use only the supplied analysis context.",
  "Do not recalculate route risk, choose another route, or modify scores.",
  "Do not invent weather, hotspots, or evidence.",
  "Do not claim a route is guaranteed safe.",
  "Explain why the recommended route was selected, how it compares with the fastest route, rainfall conditions, waterlogging evidence, and the travel-time trade-off.",
  "If the evidence is insufficient, say so.",
  "Return structured output with exactly one explanation string.",
].join(" ");

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
): Promise<string> {
  const agent = createExplanationAgent();
  const result = await agent.invoke(JSON.stringify(context));
  return (
    result.lastMessage?.content
      ?.map((block) => (block as unknown as { text?: string }).text)
      .filter((text): text is string => Boolean(text))
      .join(" ")
      .trim() ?? ""
  );
}
