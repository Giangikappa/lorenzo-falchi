import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCart from "@/components/product/AddToCart";
import PreorderForm from "@/components/product/PreorderForm";
import { prisma } from "@/lib/db";
import { parseImages, formatPrice } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: product.name,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: true,
      coupons: { include: { coupon: true } },
    },
  });

  if (!product || product.status === "DRAFT") notFound();

  const images = parseImages(product.images);
  const isSoldOut = product.status === "SOLD_OUT";
  const isPreOrder = product.status === "PRE_ORDER";
  const activePrice = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-400 mb-10">
            <a href="/shop" className="hover:text-gold transition-colors">
              Collezione
            </a>
            <span>/</span>
            <a
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-gold transition-colors"
            >
              {product.category.name}
            </a>
            <span>/</span>
            <span className="text-stone-600">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Gallery */}
            <div>
              <ProductGallery images={images} productName={product.name} />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-8">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                {product.isLimited && (
                  <span className="bg-stone-900 text-white text-[10px] tracking-widest uppercase px-3 py-1">
                    Edizione Limitata
                  </span>
                )}
                {isSoldOut && (
                  <span className="bg-red-900/80 text-white text-[10px] tracking-widest uppercase px-3 py-1">
                    Esaurito
                  </span>
                )}
                {isPreOrder && (
                  <span className="bg-gold text-white text-[10px] tracking-widest uppercase px-3 py-1">
                    Pre-ordine
                  </span>
                )}
              </div>

              <div>
                <p className="label-small mb-2">{product.category.name}</p>
                <h1 className="font-serif text-4xl md:text-5xl font-light text-stone-900 leading-tight mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl text-stone-900">
                    {formatPrice(activePrice)}
                  </span>
                  {product.salePrice && (
                    <>
                      <span className="text-lg text-stone-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs tracking-widest uppercase bg-gold/10 text-gold px-2 py-1">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              )}

              {/* Buy / Preorder / Sold out */}
              <div className="py-2">
                {isSoldOut ? (
                  <div className="border border-stone-200 p-4 text-center">
                    <p className="text-sm text-stone-500">
                      Questo articolo è attualmente esaurito.
                    </p>
                  </div>
                ) : isPreOrder ? (
                  <PreorderForm
                    productId={product.id}
                    productName={product.name}
                  />
                ) : (
                  <AddToCart
                    variants={product.variants}
                    productId={product.id}
                    productName={product.name}
                    slug={product.slug}
                    price={activePrice}
                    imageUrl={images[0] ?? ""}
                  />
                )}
              </div>

              {/* Product details */}
              <div className="border-t border-stone-100 pt-8 space-y-6">
                {product.materials && (
                  <div>
                    <p className="label-small mb-2">Materiali</p>
                    <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                      {product.materials}
                    </p>
                  </div>
                )}

                {product.details && (
                  <div>
                    <p className="label-small mb-2">Dettagli</p>
                    <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                      {product.details}
                    </p>

                  </div>
                )}

                {product.care && (
                  <div>
                    <p className="label-small mb-2">Cura del gioiello</p>
                    <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                      {product.care}
                    </p>
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className="bg-stone-100 px-5 py-4 text-xs text-stone-500 leading-relaxed">
                Spedizione in tutta Italia. Ogni pezzo viene spedito in una
                confezione regalo Lorenzo Falchi.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
