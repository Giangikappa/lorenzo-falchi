"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Props {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({ productId, productName }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      await fetch(`/api/products/${productId}`, { method: "DELETE" });
      router.refresh();
    });
  };

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-[10px] text-red-600 hover:underline disabled:opacity-50"
        >
          {isPending ? "..." : "Sì"}
        </button>
        <span className="text-stone-300">|</span>
        <button onClick={() => setConfirm(false)} className="text-[10px] text-stone-400 hover:underline">
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      title={`Elimina ${productName}`}
      className="text-stone-400 hover:text-red-500 transition-colors"
    >
      <Trash2 size={15} />
    </button>
  );
}
