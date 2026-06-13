import { prisma } from "@/lib/prisma";
import { getOrCreateDay, buildDayDTO } from "@/lib/day";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { date, closed } = (await req.json()) ?? {};
  if (!date) return Response.json({ error: "Data ausente." }, { status: 400 });

  const day = await getOrCreateDay(date);
  await prisma.day.update({
    where: { id: day.id },
    data: { closed: closed === false ? false : true },
  });
  return Response.json(await buildDayDTO(date));
}
