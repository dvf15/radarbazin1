import { prisma } from "./prisma";
import { TARGETS, isTrainingType } from "./targets";
import { sumMeals, remaining, dayFlags } from "./macros";
import type { DayDTO, TrainingType, MealDTO } from "./types";

function parseFlags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    // tolera formato antigo separado por vírgula
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

export async function getOrCreateDay(date: string) {
  const existing = await prisma.day.findUnique({
    where: { date },
    include: { meals: { orderBy: { createdAt: "asc" } } },
  });
  if (existing) return existing;

  await prisma.day.create({ data: { date } });
  return prisma.day.findUniqueOrThrow({
    where: { date },
    include: { meals: { orderBy: { createdAt: "asc" } } },
  });
}

export async function buildDayDTO(date: string): Promise<DayDTO> {
  const day = await getOrCreateDay(date);
  const training: TrainingType = isTrainingType(day.training_type)
    ? day.training_type
    : "rest";
  const targets = TARGETS[training];

  const meals: MealDTO[] = day.meals.map((m) => ({
    id: m.id,
    code: m.code,
    description: m.description,
    photo_url: m.photo_url,
    kcal: m.kcal,
    protein_g: m.protein_g,
    carb_g: m.carb_g,
    fat_g: m.fat_g,
    confidence: m.confidence,
    flags: parseFlags(m.flags),
  }));

  const totals = sumMeals(meals);
  const allFlags = meals.flatMap((m) => m.flags);

  return {
    date: day.date,
    training_type: training,
    training_notes: day.training_notes,
    closed: day.closed,
    meals,
    totals,
    targets,
    remaining: remaining(totals, targets),
    flags: dayFlags(training, totals, targets, allFlags),
  };
}
