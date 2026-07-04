import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { addBrevoContact, BREVO_LISTS } from "@/lib/brevo";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, note, productId } = body;

  if (!name || !email || !productId) {
    return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.status !== "PRE_ORDER") {
    return NextResponse.json({ error: "Prodotto non in pre-ordine" }, { status: 400 });
  }

  const preorder = await prisma.preorder.create({
    data: {
      productId,
      name,
      email,
      phone: phone || null,
      note: note || null,
    },
  });

  await addBrevoContact({
    email,
    listIds: [BREVO_LISTS.preorders],
    attributes: {
      FIRSTNAME: name,
      ...(phone && { SMS: phone }),
      PRODOTTO: product.name,
    },
  });

  return NextResponse.json(preorder, { status: 201 });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const preorders = await prisma.preorder.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true, slug: true } } },
  });
  return NextResponse.json(preorders);
}
