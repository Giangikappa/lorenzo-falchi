import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, address, note, total, items } = body;

  if (!name || !email || !address || !items?.length) {
    return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
  }

  // 1. Crea ordine in DB con stato PENDING_PAYMENT
  const order = await prisma.order.create({
    data: {
      name,
      email,
      phone: phone || null,
      address,
      note: note || null,
      total,
      status: "PENDING_PAYMENT",
      items: {
        create: items.map((i: { productName: string; size: string; price: number; qty: number }) => ({
          productName: i.productName,
          size: i.size,
          price: i.price,
          qty: i.qty,
        })),
      },
    },
  });

  // 2. Crea sessione Stripe Checkout
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    locale: "it",
    line_items: items.map((i: { productName: string; size: string; price: number; qty: number }) => ({
      price_data: {
        currency: "eur",
        unit_amount: Math.round(i.price * 100), // Stripe vuole i centesimi
        product_data: {
          name: `${i.productName} — Misura ${i.size}`,
        },
      },
      quantity: i.qty,
    })),
    metadata: { orderId: order.id },
    success_url: `${siteUrl}/checkout/grazie?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout?cancelled=1`,
  });

  // 3. Salva stripeSessionId sull'ordine
  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url }, { status: 201 });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
