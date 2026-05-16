import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/products" className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-900 transition-colors mb-4">
          <ChevronLeft size={14} />
          Torna ai prodotti
        </Link>
        <h1 className="text-2xl font-semibold text-stone-900">Nuovo prodotto</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
