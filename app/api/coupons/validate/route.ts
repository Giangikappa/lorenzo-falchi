import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Codice mancante" }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "Coupon non valido" }, { status: 404 });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "Coupon scaduto" }, { status: 400 });
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return NextResponse.json({ error: "Coupon esaurito" }, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discountPercent: coupon.discountPercent,
  });
}
