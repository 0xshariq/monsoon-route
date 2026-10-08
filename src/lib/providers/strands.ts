import { Agent } from "@strands-agents/sdk";
import { VercelModel } from "@strands-agents/sdk/models/vercel";
import { ollama } from "ai-sdk-ollama";
import { z } from "zod";

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
      provider: ollama("llama3.2") as never,
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
