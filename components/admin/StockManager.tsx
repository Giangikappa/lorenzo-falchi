"use client";

// Utility client component per aggiornamento stock rapido dalla lista prodotti
import { useState, useTransition } from "react";
import type { Variant } from "@prisma/client";

interface Props {
  productId: string;
  variants: Variant[];
}

export default function StockManager({ productId, variants: initialVariants }: Props) {
  const [variants, setVariants] = useState(initialVariants);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const updateStock = (id: string, stock: number) => {
    setVariants((v) => v.map((item) => item.id === id ? { ...item, stock } : item));
    setSaved(false);
  };

  const saveStock = () => {
    startTransition(async () => {
      await fetch(`/api/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variants }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  if (variants.length === 0) return <span className="text-xs text-stone-400">Nessuna variante</span>;

  return (
    <div className="space-y-2">
      {variants.map((v) => (
        <div key={v.id} className="flex items-center gap-2">
          <span className="text-xs text-stone-500 w-16">{v.size}</span>
          <input
            type="number"
            min="0"
            value={v.stock}
            onChange={(e) => updateStock(v.id, parseInt(e.target.value) || 0)}
            className="w-16 border border-stone-200 px-2 py-1 text-xs text-center"
          />
        </div>
      ))}
      <button
        onClick={saveStock}
        disabled={isPending}
        className="text-xs text-gold hover:underline disabled:opacity-50"
      >
        {saved ? "Salvato ✓" : "Salva stock"}
      </button>
    </div>
  );
}
