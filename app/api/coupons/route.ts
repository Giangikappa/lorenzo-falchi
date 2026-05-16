import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(coupons);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json();
  const { code, discountPercent, usageLimit, expiresAt } = body;

  if (!code || !discountPercent) {
    return NextResponse.json({ error: "Codice e sconto obbligatori" }, { status: 400 });
  }

  const exists = await prisma.coupon.findUnique({ where: { code } });
  if (exists) return NextResponse.json({ error: "Codice già esistente" }, { status: 409 });

  const coupon = await prisma.coupon.create({
    data: {
      code,
      discountPercent: parseFloat(discountPercent),
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}
