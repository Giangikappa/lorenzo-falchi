import Link from "next/link";
import Image from "next/image";
import { parseImages, formatPrice } from "@/lib/utils";
import type { ProductWithRelations } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  product: ProductWithRelations;
}

const STATUS_LABELS: Record<string, string> = {
  SOLD_OUT: "Sold Out",
  PRE_ORDER: "Pre-ordine",
  ACTIVE: "",
  DRAFT: "",
};

export default function ProductCard({ product }: Props) {
  const images = parseImages(product.images);
  const firstImage = images[0] ?? null;
  const secondImage = images[1] ?? null;
  const isLimited = product.isLimited;
  const statusLabel = STATUS_LABELS[product.status];
  const salePrice = product.salePrice;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden aspect-[3/4] bg-stone-100 mb-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {isLimited && (
            <span className="bg-stone-900 text-white text-[10px] tracking-widest uppercase px-2 py-1">
              Edizione Limitata
            </span>
          )}
          {statusLabel && (
            <span
              className={cn(
                "text-[10px] tracking-widest uppercase px-2 py-1",
                product.status === "SOLD_OUT"
                  ? "bg-red-900/80 text-white"
                  : "bg-gold text-white"
              )}
            >
              {statusLabel}
            </span>
          )}
          {salePrice && product.status === "ACTIVE" && (
            <span className="bg-gold text-white text-[10px] tracking-widest uppercase px-2 py-1">
              Scontato
            </span>
          )}
        </div>

        {/* Image */}
        {firstImage ? (
          <>
            <Image
              src={firstImage}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-all duration-700",
                secondImage ? "group-hover:opacity-0" : "group-hover:scale-105",
                product.status === "SOLD_OUT" && "grayscale opacity-70"
              )}
            />
            {secondImage && (
              <Image
                src={secondImage}
                alt={product.name}
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-100">
            <span className="text-stone-300 text-xs tracking-widest uppercase">
              Immagine
            </span>
          </div>
        )}

        {/* Sold out overlay */}
        {product.status === "SOLD_OUT" && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/20">
            <span className="bg-stone-900/80 text-white text-xs tracking-widest uppercase px-4 py-2">
              Esaurito
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-[10px] tracking-widest uppercase text-stone-400">
          {product.category.name}
        </p>
        <h3 className="text-sm font-medium text-stone-900 group-hover:text-gold transition-colors leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="text-sm font-medium text-gold">
                {formatPrice(salePrice)}
              </span>
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-stone-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
