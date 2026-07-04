import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { addBrevoContact, BREVO_LISTS } from "@/lib/brevo";

export async function POST(req: Request) {
  const body = await req.json();
  const { firstName, lastName, email, phone, message, source } = body;

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: "Nome, cognome ed email obbligatori" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: { firstName, lastName, email, phone: phone || null, message: message || null, source: source || "home" },
  });

  await addBrevoContact({
    email,
    listIds: [BREVO_LISTS.leads],
    attributes: {
      FIRSTNAME: firstName,
      LASTNAME: lastName,
      ...(phone && { TELEFONO: phone }),
      MESSAGGIO: message || "",
    },
  });

  return NextResponse.json(lead, { status: 201 });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(leads);
}
