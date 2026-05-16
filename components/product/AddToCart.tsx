"use client";

import { useState } from "react";
import type { Variant } from "@prisma/client";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cartContext";

interface Props {
  variants: Variant[];
  productId: string;
  productName: string;
  slug: string;
  price: number;
  imageUrl: string;
}

export default function AddToCart({ variants, productId, productName, slug, price, imageUrl }: Props) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.length === 1 ? variants[0] : null
  );
  const [added, setAdded] = useState(false);

  const inStock = variants.some((v) => v.stock > 0);
  const selectedInStock = selectedVariant ? selectedVariant.stock > 0 : false;

  if (!inStock) {
    return (
      <button disabled className="btn-primary w-full opacity-40 cursor-not-allowed">
        Esaurito
      </button>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedInStock) return;

    addItem({
      variantId: selectedVariant.id,
      productId,
      productName,
      slug,
      size: selectedVariant.size,
      price,
      imageUrl,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Size selector */}
      {variants.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs tracking-widest uppercase text-stone-500">
              Misura
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                disabled={v.stock === 0}
                className={`
                  min-w-[3rem] px-3 py-2 text-xs border transition-colors
                  ${v.stock === 0 ? "opacity-30 cursor-not-allowed line-through" : ""}
                  ${
                    selectedVariant?.id === v.id
                      ? "bg-stone-900 text-white border-stone-900"
                      : "border-stone-200 text-stone-600 hover:border-stone-900"
                  }
                `}
              >
                {v.size}
                {v.stock < 3 && v.stock > 0 && (
                  <span className="ml-1 text-gold text-[9px]">({v.stock})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={!selectedVariant || !selectedInStock}
        className="btn-primary w-full gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {added ? (
          <>
            <Check size={16} />
            Aggiunto al carrello
          </>
        ) : (
          <>
            <ShoppingBag size={16} />
            Aggiungi al carrello
          </>
        )}
      </button>

      {variants.length > 1 && !selectedVariant && (
        <p className="text-xs text-stone-400 text-center">
          Seleziona una misura per continuare
        </p>
      )}
    </div>
  );
}
