"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Category } from "@prisma/client";
import type { ProductWithRelations } from "@/types";
import StockManager from "@/components/admin/StockManager";
import { Plus, Trash2, Loader2, Upload, Link } from "lucide-react";

interface Props {
  categories: Category[];
  product?: ProductWithRelations;
}

interface VariantForm {
  id?: string;
  size: string;
  stock: number;
  sku: string;
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    details: product?.details ?? "",
    materials: product?.materials ?? "",
    care: product?.care ?? "",
    price: product?.price?.toString() ?? "",
    salePrice: product?.salePrice?.toString() ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    status: product?.status ?? "ACTIVE",
    isLimited: product?.isLimited ?? false,
    images: product?.images ?? "[]",
  });

  const [variants, setVariants] = useState<VariantForm[]>(
    product?.variants.map((v) => ({
      id: v.id,
      size: v.size,
      stock: v.stock,
      sku: v.sku ?? "",
    })) ?? [{ size: "", stock: 0, sku: "" }]
  );

  const [imageUrls, setImageUrls] = useState<string[]>(
    (() => {
      try { return JSON.parse(product?.images ?? "[]"); } catch { return []; }
    })()
  );
  const [newUrl, setNewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addVariant = () => setVariants((v) => [...v, { size: "", stock: 0, sku: "" }]);
  const removeVariant = (i: number) => setVariants((v) => v.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: keyof VariantForm, value: string | number) => {
    setVariants((v) => v.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  const addImage = () => {
    if (!newUrl.trim()) return;
    setImageUrls((prev) => [...prev, newUrl.trim()]);
    setNewUrl("");
  };
  const removeImage = (i: number) => setImageUrls((prev) => prev.filter((_, idx) => idx !== i));

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const valid = Array.from(files).filter((f) => allowed.includes(f.type));
    if (valid.length === 0) return;

    setUploading(true);
    try {
      const fd = new FormData();
      valid.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload fallito");
      const data = await res.json();
      setImageUrls((prev) => [...prev, ...data.urls]);
    } catch {
      setError("Errore durante l'upload. Riprova.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }, [uploadFiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const payload = {
          ...form,
          price: parseFloat(form.price),
          salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
          images: JSON.stringify(imageUrls),
          variants: variants.filter((v) => v.size.trim()),
        };

        const url = product ? `/api/products/${product.id}` : "/api/products";
        const method = product ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Errore nel salvataggio");
          return;
        }

        router.push("/admin/products");
        router.refresh();
      } catch {
        setError("Errore di rete");
      }
    });
  };

  const inputCls = "w-full border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-900 transition-colors";
  const labelCls = "block text-xs tracking-widest uppercase text-stone-500 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Informazioni base */}
      <div className="bg-white p-6 space-y-6">
        <h2 className="font-semibold text-stone-900 pb-4 border-b border-stone-100">
          Informazioni prodotto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelCls}>Nome prodotto *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Es. Anello Sole d'Oro"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Categoria *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className={inputCls}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Stato *</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inputCls}
            >
              <option value="ACTIVE">Disponibile</option>
              <option value="PRE_ORDER">Pre-ordine</option>
              <option value="SOLD_OUT">Sold out</option>
              <option value="DRAFT">Bozza</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Prezzo (€) *</label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Prezzo scontato (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
              placeholder="Lascia vuoto se non scontato"
              className={inputCls}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isLimited}
                onChange={(e) => setForm({ ...form, isLimited: e.target.checked })}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-sm text-stone-700">Edizione limitata</span>
            </label>
          </div>
        </div>

        <div>
          <label className={labelCls}>Descrizione</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descrizione del prodotto mostrata sulla pagina..."
            className={inputCls + " resize-none"}
          />
        </div>
      </div>

      {/* Dettagli tecnici */}
      <div className="bg-white p-6 space-y-6">
        <h2 className="font-semibold text-stone-900 pb-4 border-b border-stone-100">
          Dettagli tecnici
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Materiali</label>
            <input
              value={form.materials}
              onChange={(e) => setForm({ ...form, materials: e.target.value })}
              placeholder="Es. Oro 18kt, Diamante 0.5ct"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Cura del gioiello</label>
            <input
              value={form.care}
              onChange={(e) => setForm({ ...form, care: e.target.value })}
              placeholder="Es. Evitare contatto con acqua"
              className={inputCls}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Informazioni aggiuntive</label>
            <textarea
              rows={3}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              placeholder="Misure, peso, certificazioni, note..."
              className={inputCls + " resize-none"}
            />
          </div>
        </div>
      </div>

      {/* Immagini */}
      <div className="bg-white p-6 space-y-5">
        <h2 className="font-semibold text-stone-900 pb-4 border-b border-stone-100">
          Immagini
        </h2>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-none cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 py-10 px-6 text-center
            ${dragOver ? "border-gold bg-gold/5" : "border-stone-200 hover:border-stone-400"}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
          {uploading ? (
            <Loader2 size={24} className="text-gold animate-spin" />
          ) : (
            <Upload size={24} className="text-stone-400" />
          )}
          <div>
            <p className="text-sm font-medium text-stone-700">
              {uploading ? "Caricamento in corso…" : "Trascina le foto qui, o clicca per selezionarle"}
            </p>
            <p className="text-xs text-stone-400 mt-1">JPG, PNG, WEBP, GIF — più file alla volta</p>
          </div>
        </div>

        {/* URL manuale */}
        <div className="flex gap-3 items-center">
          <Link size={14} className="text-stone-400 flex-shrink-0" />
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Oppure incolla un URL esterno…"
            className={inputCls + " flex-1"}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
          />
          <button type="button" onClick={addImage} className="btn-outline px-3 py-2">
            <Plus size={15} />
          </button>
        </div>

        {/* Preview griglia */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {imageUrls.map((url, i) => (
              <div key={url + i} className="relative group aspect-square bg-stone-100">
                <Image
                  src={url}
                  alt={`Foto ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={url.startsWith("/uploads")}
                />
                {/* Badge ordine */}
                <span className="absolute top-1 left-1 bg-stone-900/70 text-white text-[10px] w-5 h-5 flex items-center justify-center">
                  {i + 1}
                </span>
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Varianti / Stock */}
      <div className="bg-white p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900">Taglie e Stock</h2>
          <button type="button" onClick={addVariant} className="btn-outline px-4 py-2 text-xs gap-1">
            <Plus size={14} />
            Aggiungi taglia
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-3 text-xs tracking-widest uppercase text-stone-400 px-1">
            <span className="col-span-4">Taglia</span>
            <span className="col-span-3">Stock</span>
            <span className="col-span-4">SKU</span>
            <span className="col-span-1" />
          </div>

          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-center">
              <input
                value={v.size}
                onChange={(e) => updateVariant(i, "size", e.target.value)}
                placeholder="Es. 14, S, 52mm"
                className={inputCls + " col-span-4"}
              />
              <input
                type="number"
                min="0"
                value={v.stock}
                onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)}
                className={inputCls + " col-span-3"}
              />
              <input
                value={v.sku}
                onChange={(e) => updateVariant(i, "sku", e.target.value)}
                placeholder="SKU"
                className={inputCls + " col-span-4"}
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="col-span-1 text-stone-300 hover:text-red-400 transition-colors flex justify-center"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary gap-2 disabled:opacity-60"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {product ? "Aggiorna prodotto" : "Crea prodotto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="btn-outline"
        >
          Annulla
        </button>
      </div>
    </form>
  );
}
