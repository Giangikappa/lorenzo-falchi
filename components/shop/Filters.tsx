"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Category } from "@prisma/client";
import { X } from "lucide-react";

interface Props {
  categories: Category[];
}

const STATUS_OPTIONS = [
  { value: "", label: "Tutti" },
  { value: "ACTIVE", label: "Disponibili" },
  { value: "PRE_ORDER", label: "Pre-ordine" },
  { value: "SOLD_OUT", label: "Sold out" },
  { value: "limited", label: "Edizione limitata" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Più recenti" },
  { value: "price_asc", label: "Prezzo: crescente" },
  { value: "price_desc", label: "Prezzo: decrescente" },
];

export default function Filters({ categories }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(params.toString());
      if (value) {
        p.set(key, value);
      } else {
        p.delete(key);
      }
      router.push(`/shop?${p.toString()}`);
    },
    [params, router]
  );

  const category = params.get("category") ?? "";
  const status = params.get("status") ?? "";
  const sort = params.get("sort") ?? "newest";
  const search = params.get("search") ?? "";
  const hasFilters = category || status || search;

  const clearAll = () => {
    router.push("/shop");
  };

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="relative mb-8">
        <input
          type="text"
          defaultValue={search}
          placeholder="Cerca prodotto..."
          onChange={(e) => {
            const val = e.target.value;
            const timeout = setTimeout(() => update("search", val), 400);
            return () => clearTimeout(timeout);
          }}
          className="input-base pr-8"
        />
        {search && (
          <button
            onClick={() => update("search", "")}
            className="absolute right-0 top-3 text-stone-400 hover:text-stone-900"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <p className="label-small mb-4">Categoria</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => update("category", "")}
            className={`text-xs tracking-widest uppercase px-3 py-2 border transition-colors ${
              !category
                ? "bg-stone-900 text-white border-stone-900"
                : "border-stone-200 text-stone-500 hover:border-stone-900 hover:text-stone-900"
            }`}
          >
            Tutti
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => update("category", cat.slug)}
              className={`text-xs tracking-widest uppercase px-3 py-2 border transition-colors ${
                category === cat.slug
                  ? "bg-stone-900 text-white border-stone-900"
                  : "border-stone-200 text-stone-500 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mb-8">
        <p className="label-small mb-4">Disponibilità</p>
        <div className="flex flex-col gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("status", opt.value)}
              className={`text-sm text-left py-1 transition-colors ${
                status === opt.value
                  ? "text-gold font-medium"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="mb-8">
        <p className="label-small mb-4">Ordina per</p>
        <div className="flex flex-col gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("sort", opt.value)}
              className={`text-sm text-left py-1 transition-colors ${
                sort === opt.value
                  ? "text-gold font-medium"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-xs tracking-widest uppercase text-red-500 hover:underline flex items-center gap-1"
        >
          <X size={12} />
          Rimuovi filtri
        </button>
      )}
    </div>
  );
}
