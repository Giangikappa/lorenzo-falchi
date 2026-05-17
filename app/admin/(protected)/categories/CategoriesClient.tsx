"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
}

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore");
      }
      const newCat = await res.json();
      setCategories([...categories, { ...newCat, _count: { products: 0 } }].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      setDescription("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, productCount: number) => {
    if (productCount > 0) {
      alert(`Non puoi eliminare questa categoria — ha ${productCount} prodotti collegati.`);
      return;
    }
    if (!confirm("Eliminare questa categoria?")) return;
    await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-serif text-stone-900 mb-8">Categorie</h1>

      {/* Form nuova categoria */}
      <form onSubmit={handleCreate} className="bg-white border border-stone-200 p-6 mb-8 space-y-4">
        <h2 className="text-sm font-medium tracking-widest uppercase text-stone-500">
          Nuova categoria
        </h2>
        <div>
          <label className="text-xs tracking-widest uppercase text-stone-400 block mb-1">
            Nome *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Es. Anelli"
            className="w-full border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-stone-400"
            required
          />
        </div>
        <div>
          <label className="text-xs tracking-widest uppercase text-stone-400 block mb-1">
            Descrizione (opzionale)
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve descrizione della categoria"
            className="w-full border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-stone-400"
          />
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-gold gap-2 disabled:opacity-60"
        >
          <Plus size={15} />
          {loading ? "Salvo..." : "Aggiungi categoria"}
        </button>
      </form>

      {/* Lista categorie */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-stone-400 text-sm">Nessuna categoria. Aggiungine una sopra.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between bg-white border border-stone-200 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-stone-900">{cat.name}</p>
                <p className="text-xs text-stone-400">
                  {cat._count.products} prodott{cat._count.products === 1 ? "o" : "i"}
                  {cat.description && ` · ${cat.description}`}
                </p>
              </div>
              <button
                onClick={() => handleDelete(cat.id, cat._count.products)}
                className="text-stone-300 hover:text-red-400 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
