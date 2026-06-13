import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Alimentos com macros fixos (valores por porção informada).
const knownFoods = [
  { name: "Rap10 tortilla", serving_g: 40, kcal_per_serving: 93, protein_g: 2.9, carb_g: 18, fat_g: 1, notes: "tortilla" },
  { name: "Whey scoop padrão", serving_g: 30, kcal_per_serving: 120, protein_g: 24, carb_g: 2, fat_g: 2, notes: "1 scoop" },
  { name: "CarboLift palatinose", serving_g: 30, kcal_per_serving: 116, protein_g: 0, carb_g: 29, fat_g: 0, notes: "palatinose" },
  { name: "SuperCoffee 3.0", serving_g: 10, kcal_per_serving: 40, protein_g: 2, carb_g: 1, fat_g: 3, notes: "" },
  { name: "Creatina", serving_g: 5, kcal_per_serving: 0, protein_g: 0, carb_g: 0, fat_g: 0, notes: "" },
  { name: "Koala Sleep", serving_g: 12, kcal_per_serving: 31, protein_g: 0, carb_g: 6, fat_g: 0.5, notes: "" },
  { name: "Iogurte desnatado", serving_g: 250, kcal_per_serving: 150, protein_g: 25, carb_g: 15, fat_g: 0, notes: "" },
  { name: "Yorgus grego integral", serving_g: 250, kcal_per_serving: 200, protein_g: 17, carb_g: 9, fat_g: 11, notes: "sem açúcar adicionado" },
  { name: "PeptiStrong / LiftStrong", serving_g: 7.9, kcal_per_serving: 23, protein_g: 2.5, carb_g: 2, fat_g: 0.5, notes: "" },
];

async function main() {
  for (const f of knownFoods) {
    await prisma.knownFood.upsert({ where: { name: f.name }, update: f, create: f });
  }
  console.log(`Seed: ${knownFoods.length} alimentos conhecidos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
