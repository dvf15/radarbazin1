import { prisma } from "@/lib/prisma";
import { getOrCreateDay, buildDayDTO } from "@/lib/day";
import { isTrainingType } from "@/lib/targets";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { date, training_type, training_notes } = (await req.json()) ?? {};
  if (!date) return Response.json({ error: "Data ausente." }, { status: 400 });
  if (!isTrainingType(String(training_type))) {
    return Response.json({ error: "Tipo de treino inválido." }, { status: 400 });
  }

  const day = await getOrCreateDay(date);
  await prisma.day.update({
    where: { id: day.id },
    data: {
      training_type,
      training_notes:
        training_notes === undefined ? day.training_notes : training_notes || null,
    },
  });
  return Response.json(await buildDayDTO(date));
}
