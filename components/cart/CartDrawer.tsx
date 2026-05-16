"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, removeItem, updateQty, totalItems, totalPrice, isOpen, closeCart } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-stone-900/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-stone-50 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-stone-700" />
            <h2 className="font-medium text-stone-900">
              Carrello
              {totalItems > 0 && (
                <span className="ml-2 text-xs text-stone-400">({totalItems} articoli)</span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="text-stone-400 hover:text-stone-900 transition-colors"
            aria-label="Chiudi carrello"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-stone-400">
              <ShoppingBag size={48} className="opacity-20" />
              <p className="text-sm">Il carrello è vuoto</p>
              <button
                onClick={closeCart}
                className="text-xs tracking-widest uppercase text-gold hover:underline mt-2"
              >
                Continua a sfogliare
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variantId} className="flex gap-4 bg-white p-3">
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 bg-stone-100">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      unoptimized={item.imageUrl.startsWith("/uploads")}
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-200" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="text-sm font-medium text-stone-900 hover:text-gold transition-colors line-clamp-2"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs text-stone-400 mt-0.5">Misura: {item.size}</p>
                  <p className="text-sm font-medium text-stone-900 mt-1">
                    {formatPrice(item.price * item.qty)}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.variantId, item.qty - 1)}
                      className="w-6 h-6 border border-stone-200 flex items-center justify-center text-stone-500 hover:border-stone-900 hover:text-stone-900 transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-sm w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.variantId, item.qty + 1)}
                      className="w-6 h-6 border border-stone-200 flex items-center justify-center text-stone-500 hover:border-stone-900 hover:text-stone-900 transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="ml-auto text-stone-300 hover:text-red-400 transition-colors"
                      aria-label="Rimuovi"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-200 bg-white px-6 py-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500">Totale</span>
              <span className="font-serif text-xl text-stone-900">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-stone-400">
              Spedizione calcolata al checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center py-3"
            >
              Concludi ordine
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-xs tracking-widest uppercase text-stone-400 hover:text-stone-900 transition-colors py-1"
            >
              Continua lo shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
