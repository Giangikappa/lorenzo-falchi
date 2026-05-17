export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import CategoriesClient from "./CategoriesClient";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return <CategoriesClient initialCategories={categories} />;
}
