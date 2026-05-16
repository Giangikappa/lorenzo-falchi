import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, message, source } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Nome ed email obbligatori" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: { name, email, phone: phone || null, message: message || null, source: source || "home" },
  });

  return NextResponse.json(lead, { status: 201 });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(leads);
}
