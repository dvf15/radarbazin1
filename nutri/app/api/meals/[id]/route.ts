import { prisma } from "@/lib/prisma";
import { buildDayDTO } from "@/lib/day";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const meal = await prisma.meal.findUnique({
    where: { id: params.id },
    include: { day: true },
  });
  if (!meal) {
    return Response.json({ error: "Refeição não encontrada." }, { status: 404 });
  }
  await prisma.meal.delete({ where: { id: params.id } });
  return Response.json(await buildDayDTO(meal.day.date));
}
