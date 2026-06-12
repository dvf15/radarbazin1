import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import type { Estimate } from "@/lib/types";

export const runtime = "nodejs";

const r = (n: number) => Math.round(n || 0);

function parseEstimate(raw: string): Estimate {
  const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(clean);
  } catch {
    const s = clean.indexOf("{");
    const e = clean.lastIndexOf("}");
    if (s >= 0 && e > s) obj = JSON.parse(clean.slice(s, e + 1));
    else throw new Error("Resposta da IA não veio em JSON.");
  }
  const arr = (v: unknown): string[] =>
    Array.isArray(v) ? v.map((x) => String(x)) : [];
  return {
    description: String(obj.description ?? "Refeição"),
    kcal: r(Number(obj.kcal)),
    protein_g: r(Number(obj.protein_g)),
    carb_g: r(Number(obj.carb_g)),
    fat_g: r(Number(obj.fat_g)),
    confidence: Math.max(1, Math.min(10, r(Number(obj.confidence) || 5))),
    flags: arr(obj.flags),
    uncertainties: arr(obj.uncertainties),
    questions: arr(obj.questions),
  };
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY ausente — configure no arquivo .env." },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { text, imageBase64, imageMediaType, dayContext } = body ?? {};

  if (!text && !imageBase64) {
    return Response.json(
      { error: "Envie uma foto ou uma descrição da refeição." },
      { status: 400 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any[] = [];

  if (imageBase64) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: imageMediaType || "image/jpeg",
        data: imageBase64,
      },
    });
  }

  content.push({
    type: "text",
    text: text
      ? `Refeição descrita pelo usuário: "${text}"`
      : "Estime os macros desta refeição na foto.",
  });

  if (dayContext?.totals && dayContext?.remaining) {
    content.push({
      type: "text",
      text: `CONTEXTO DO DIA (${dayContext.trainingType}):
Já consumido hoje: ${r(dayContext.totals.kcal)} kcal | P:${r(dayContext.totals.protein_g)}g | C:${r(dayContext.totals.carb_g)}g | G:${r(dayContext.totals.fat_g)}g
Falta pra meta: kcal:${r(dayContext.remaining.kcal)} | P:${r(dayContext.remaining.protein_g)}g | C:${r(dayContext.remaining.carb_g)}g | G:${r(dayContext.remaining.fat_g)}g`,
    });
  }

  const client = new Anthropic();

  try {
    const resp = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });
    const out = resp.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    return Response.json(parseEstimate(out));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Falha ao estimar.";
    return Response.json({ error: msg }, { status: 502 });
  }
}
