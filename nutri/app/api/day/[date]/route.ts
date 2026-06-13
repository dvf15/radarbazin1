import { buildDayDTO } from "@/lib/day";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { date: string } }
) {
  return Response.json(await buildDayDTO(params.date));
}
