import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Filters from "@/components/shop/Filters";
import ProductCard from "@/components/shop/ProductCard";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

interface SearchParams {
  category?: string;
  status?: string;
  sort?: string;
  search?: string;
}

async function ProductGrid({ searchParams }: { searchParams: SearchParams }) {
  const { category, status, sort = "newest", search } = searchParams;

  const where: Prisma.ProductWhereInput = {
    status: { not: "DRAFT" },
  };

  if (category) {
    where.category = { slug: category };
  }

  if (status === "limited") {
    where.isLimited = true;
  } else if (status && status !== "limited") {
    where.status = status as "ACTIVE" | "SOLD_OUT" | "PRE_ORDER";
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      variants: true,
      coupons: { include: { coupon: true } },
    },
  });

  if (products.length === 0) {
    return (
      <div className="col-span-3 text-center py-24">
        <p className="font-serif text-3xl text-stone-300 mb-4">
          Nessun prodotto trovato
        </p>
        <p className="text-sm text-stone-400">
          Prova a cambiare i filtri di ricerca
        </p>
      </div>
    );
  }

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-stone-50">
        {/* Page header */}
        <div className="bg-white border-b border-stone-100 py-12 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <p className="label-small mb-2">Esplora</p>
            <h1 className="section-title">La Collezione</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar filters */}
            <aside className="lg:w-56 flex-shrink-0">
              <Suspense fallback={null}>
                <Filters categories={categories} />
              </Suspense>
            </aside>

            {/* Product grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                <Suspense
                  fallback={
                    <>
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[3/4] bg-stone-100 animate-pulse"
                        />
                      ))}
                    </>
                  }
                >
                  <ProductGrid searchParams={sp} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
