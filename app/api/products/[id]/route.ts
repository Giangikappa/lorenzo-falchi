import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

interface Ctx { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true, coupons: { include: { coupon: true } } },
  });
  if (!product) return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, description, details, materials, care, price, salePrice,
    categoryId, status, isLimited, images, variants } = body;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Non trovato" }, { status: 404 });

  let slug = existing.slug;
  if (name !== existing.name) {
    const baseSlug = slugify(name);
    slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findFirst({ where: { slug, NOT: { id } } })) {
      slug = `${baseSlug}-${counter++}`;
    }
  }

  // Upsert variants
  const existingVariants = await prisma.variant.findMany({ where: { productId: id } });
  const incomingIds = (variants ?? []).filter((v: { id?: string }) => v.id).map((v: { id: string }) => v.id);
  const toDelete = existingVariants.filter((v) => !incomingIds.includes(v.id));

  await prisma.$transaction([
    ...toDelete.map((v) => prisma.variant.delete({ where: { id: v.id } })),
    ...(variants ?? []).map((v: { id?: string; size: string; stock: number; sku?: string }) =>
      v.id
        ? prisma.variant.update({
            where: { id: v.id },
            data: { size: v.size, stock: v.stock, sku: v.sku ?? null },
          })
        : prisma.variant.create({
            data: {
              productId: id,
              size: v.size,
              stock: v.stock ?? 0,
              sku: v.sku ?? null,
            },
          })
    ),
    prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        details,
        materials,
        care,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        categoryId,
        status,
        isLimited: Boolean(isLimited),
        images: typeof images === "string" ? images : JSON.stringify(images),
      },
    }),
  ]);

  const updated = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
