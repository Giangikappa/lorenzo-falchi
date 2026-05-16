import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { status: { not: "DRAFT" } },
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json();
  const { name, description, details, materials, care, price, salePrice,
    categoryId, status, isLimited, images, variants } = body;

  if (!name || !price || !categoryId) {
    return NextResponse.json({ error: "Campi obbligatori mancanti" }, { status: 400 });
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const product = await prisma.product.create({
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
      variants: {
        create: (variants ?? []).map((v: { size: string; stock: number; sku?: string }) => ({
          size: v.size,
          stock: v.stock ?? 0,
          sku: v.sku ?? null,
        })),
      },
    },
    include: { category: true, variants: true },
  });

  return NextResponse.json(product, { status: 201 });
}
