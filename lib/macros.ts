import type { Macros, Targets, TrainingType } from "./types";

export function sumMeals(
  meals: { kcal: number; protein_g: number; carb_g: number; fat_g: number }[]
): Macros {
  return meals.reduce(
    (a, m) => ({
      kcal: a.kcal + m.kcal,
      protein_g: a.protein_g + m.protein_g,
      carb_g: a.carb_g + m.carb_g,
      fat_g: a.fat_g + m.fat_g,
    }),
    { kcal: 0, protein_g: 0, carb_g: 0, fat_g: 0 }
  );
}

// Saldo restante: sempre contra o TETO da faixa.
export function remaining(totals: Macros, t: Targets): Macros {
  return {
    kcal: t.kcal[1] - totals.kcal,
    protein_g: t.protein_g[1] - totals.protein_g,
    carb_g: t.carb_g[1] - totals.carb_g,
    fat_g: t.fat_g[1] - totals.fat_g,
  };
}

export type MacroStatus = "over" | "good" | "under";

export function macroStatus(value: number, target: [number, number]): MacroStatus {
  const [min, max] = target;
  if (value > max * 1.1) return "over"; // vermelho
  if (value >= min * 0.8) return "good"; // verde
  return "under"; // amarelo
}

export function nextMealCode(meals: { code: string }[]): string {
  if (meals.length === 0) return "R1";
  const nums = meals.map((m) => parseInt(m.code.replace(/[^0-9]/g, ""), 10) || 0);
  return `R${Math.max(...nums) + 1}`;
}

export interface DayFlag {
  message: string;
  type: "warning" | "success";
}

export function dayFlags(
  training: TrainingType,
  totals: Macros,
  t: Targets,
  mealFlags: string[]
): DayFlag[] {
  const out: DayFlag[] = [];
  if (mealFlags.includes("saturada_alta")) {
    out.push({
      message: "⚠️ Gordura saturada concentrada hoje — atenção ao LDL 137",
      type: "warning",
    });
  }
  if (["bjj", "double", "legs"].includes(training) && totals.carb_g < t.carb_g[0] * 0.75) {
    out.push({ message: "⚠️ Carbo abaixo do alvo pra esse tipo de treino", type: "warning" });
  }
  if (["bjj", "double"].includes(training) && totals.kcal < t.kcal[0] * 0.8) {
    out.push({
      message: "⚠️ Déficit calórico agressivo em dia de treino pesado",
      type: "warning",
    });
  }
  if (totals.protein_g >= t.protein_g[0]) {
    out.push({ message: "✅ Proteína no alvo", type: "success" });
  }
  return out;
}
