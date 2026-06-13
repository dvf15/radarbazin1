import type { TrainingType, Targets } from "./types";

export const TARGETS: Record<TrainingType, Targets> = {
  rest: { kcal: [2900, 3000], protein_g: [220, 240], carb_g: [180, 230], fat_g: [80, 100] },
  light: { kcal: [3000, 3100], protein_g: [220, 240], carb_g: [200, 280], fat_g: [80, 100] },
  strength: { kcal: [3100, 3300], protein_g: [220, 240], carb_g: [250, 320], fat_g: [80, 100] },
  legs: { kcal: [3100, 3300], protein_g: [220, 240], carb_g: [300, 350], fat_g: [80, 100] },
  bjj: { kcal: [3300, 3400], protein_g: [220, 240], carb_g: [320, 400], fat_g: [85, 105] },
  double: { kcal: [3300, 3500], protein_g: [230, 250], carb_g: [350, 420], fat_g: [85, 105] },
};

export const TRAINING_LABELS: Record<TrainingType, string> = {
  rest: "Descanso",
  light: "Treino leve",
  strength: "Musculação",
  legs: "Pernas",
  bjj: "BJJ",
  double: "Duplo (BJJ + musc.)",
};

export const TRAINING_TYPES: TrainingType[] = [
  "rest",
  "light",
  "strength",
  "legs",
  "bjj",
  "double",
];

export function isTrainingType(v: string): v is TrainingType {
  return (TRAINING_TYPES as string[]).includes(v);
}
