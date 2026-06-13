import { prisma } from "@/lib/prisma";
import { TARGETS, isTrainingType } from "@/lib/targets";
import { sumMeals } from "@/lib/macros";
import type { TrainingType } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = Math.max(1, Math.min(90, Number(searchParams.get("days")) || 14));

  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  const sinceKey = since.toLocaleDateString("en-CA");

  const rows = await prisma.day.findMany({
    where: { date: { gte: sinceKey } },
    include: { meals: true },
    orderBy: { date: "asc" },
  });

  const data = rows
    .filter((d) => d.meals.length > 0)
    .map((d) => {
      const training: TrainingType = isTrainingType(d.training_type)
        ? d.training_type
        : "rest";
      const t = TARGETS[training];
      const totals = sumMeals(d.meals);
      const mid = (x: [number, number]) => Math.round((x[0] + x[1]) / 2);
      return {
        date: d.date,
        label: d.date.slice(5), // MM-DD
        training_type: training,
        closed: d.closed,
        kcal: Math.round(totals.kcal),
        protein_g: Math.round(totals.protein_g),
        carb_g: Math.round(totals.carb_g),
        fat_g: Math.round(totals.fat_g),
        meta_kcal: mid(t.kcal),
        meta_protein: mid(t.protein_g),
        meta_carb: mid(t.carb_g),
        meta_fat: mid(t.fat_g),
      };
    });

  return Response.json({ days: data });
}
