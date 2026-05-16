import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email obbligatoria" }, { status: 400 });
  }

  const existing = await prisma.newsletter.findUnique({ where: { email } });
  if (existing) {
    if (existing.active) {
      return NextResponse.json({ message: "Già iscritto" }, { status: 200 });
    }
    // Riattiva se aveva disiscritto
    await prisma.newsletter.update({ where: { email }, data: { active: true } });
    return NextResponse.json({ message: "Iscrizione riattivata" }, { status: 200 });
  }

  await prisma.newsletter.create({ data: { email } });
  return NextResponse.json({ message: "Iscritto con successo" }, { status: 201 });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const subscribers = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(subscribers);
}
