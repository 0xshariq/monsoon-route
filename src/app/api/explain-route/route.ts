import { NextResponse } from "next/server";
import { z } from "zod";
import { explainRouteWithStrands } from "@/lib/providers/strands";

export const runtime = "nodejs";

const explanationRequestSchema = z.object({
  context: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  try {
    const payload = explanationRequestSchema.parse(await request.json());
    const explanation = await explainRouteWithStrands(payload.context);
    return NextResponse.json({ explanation });
  } catch {
    return NextResponse.json(
      { error: "Unable to generate a route explanation." },
      { status: 400 },
    );
  }
}
