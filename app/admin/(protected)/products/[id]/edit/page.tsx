import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        coupons: { include: { coupon: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/products" className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-900 transition-colors mb-4">
          <ChevronLeft size={14} />
          Torna ai prodotti
        </Link>
        <h1 className="text-2xl font-semibold text-stone-900">
          Modifica: {product.name}
        </h1>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
