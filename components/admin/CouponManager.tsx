"use client";

import { useState, useTransition } from "react";
import type { Coupon } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  initialCoupons: Coupon[];
}

export default function CouponManager({ initialCoupons }: Props) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [form, setForm] = useState({
    code: "",
    discountPercent: "",
    usageLimit: "",
    expiresAt: "",
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const inputCls = "border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-900 transition-colors";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase().trim(),
          discountPercent: parseFloat(form.discountPercent),
          usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
          expiresAt: form.expiresAt || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Errore");
        return;
      }
      const created = await res.json();
      setCoupons((c) => [created, ...c]);
      setForm({ code: "", discountPercent: "", usageLimit: "", expiresAt: "" });
      router.refresh();
    });
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    setCoupons((c) => c.filter((coupon) => coupon.id !== id));
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    setCoupons((c) =>
      c.map((coupon) => coupon.id === id ? { ...coupon, active: !active } : coupon)
    );
  };

  return (
    <div className="space-y-8">
      {/* Create form */}
      <div className="bg-white p-6">
        <h2 className="font-semibold text-stone-900 mb-6">Crea nuovo coupon</h2>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">Codice *</label>
            <input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="ESTATE20"
              className={inputCls + " w-36"}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">Sconto % *</label>
            <input
              required
              type="number"
              min="1"
              max="100"
              value={form.discountPercent}
              onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
              placeholder="20"
              className={inputCls + " w-24"}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">Limite utilizzi</label>
            <input
              type="number"
              min="1"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
              placeholder="∞"
              className={inputCls + " w-24"}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">Scade il</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className={inputCls + " w-40"}
            />
          </div>

          {error && <p className="w-full text-red-500 text-xs">{error}</p>}

          <button type="submit" disabled={isPending} className="btn-primary gap-2 disabled:opacity-60">
            <Plus size={16} />
            Crea coupon
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100">
              {["Codice", "Sconto", "Utilizzi", "Scade", "Stato", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-stone-400 text-sm">
                  Nessun coupon.
                </td>
              </tr>
            )}
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-stone-50 hover:bg-stone-50">
                <td className="px-4 py-3 font-mono font-medium text-stone-900">
                  {coupon.code}
                </td>
                <td className="px-4 py-3 text-gold font-medium">
                  -{coupon.discountPercent}%
                </td>
                <td className="px-4 py-3 text-stone-500">
                  {coupon.usageCount} / {coupon.usageLimit ?? "∞"}
                </td>
                <td className="px-4 py-3 text-stone-400 text-xs">
                  {coupon.expiresAt
                    ? new Date(coupon.expiresAt).toLocaleDateString("it-IT")
                    : "Nessuna scadenza"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(coupon.id, coupon.active)}
                    className={`text-[10px] tracking-widest uppercase px-2 py-1 transition-colors ${
                      coupon.active
                        ? "bg-green-100 text-green-700"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {coupon.active ? "Attivo" : "Disattivo"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="text-stone-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
