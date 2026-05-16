import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = ["PENDING_PAYMENT", "PAID", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Stato non valido" }, { status: 400 });
  }

  const order = await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json(order);
}
