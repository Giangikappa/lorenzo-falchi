import Link from "next/link";
import { prisma } from "@/lib/db";
import { parseImages, formatPrice } from "@/lib/utils";
import ProductCard from "@/components/shop/ProductCard";

export default async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { status: { not: "DRAFT" } },
    include: { category: true, variants: true, coupons: { include: { coupon: true } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <section className="py-24 px-6 lg:px-12 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="label-small mb-3">Ultimi Arrivi</p>
            <h2 className="section-title">La Collezione</h2>
          </div>
          <Link href="/shop" className="btn-outline self-start md:self-auto">
            Vedi tutto
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-stone-100 animate-pulse rounded-none" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
