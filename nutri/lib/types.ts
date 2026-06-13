export type TrainingType =
  | "rest"
  | "light"
  | "strength"
  | "bjj"
  | "double"
  | "legs";

export interface Macros {
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
}

export interface Targets {
  kcal: [number, number];
  protein_g: [number, number];
  carb_g: [number, number];
  fat_g: [number, number];
}

export interface Estimate {
  description: string;
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  confidence: number;
  flags: string[];
  uncertainties: string[];
  questions: string[];
}

export interface MealDTO {
  id: string;
  code: string;
  description: string;
  photo_url: string | null;
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  confidence: number;
  flags: string[];
}

export interface DayDTO {
  date: string;
  training_type: TrainingType;
  training_notes: string | null;
  closed: boolean;
  meals: MealDTO[];
  totals: Macros;
  targets: Targets;
  remaining: Macros;
  flags: { message: string; type: "warning" | "success" }[];
}
