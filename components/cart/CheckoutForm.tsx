"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { formatPrice } from "@/lib/utils";

export default function CheckoutForm() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400">
        <ShoppingBag size={40} className="mx-auto mb-4 opacity-20" />
        <p className="text-sm mb-4">Il carrello è vuoto.</p>
        <button
          onClick={() => router.push("/shop")}
          className="text-xs tracking-widest uppercase text-gold hover:underline"
        >
          Vai alla collezione
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          total: totalPrice,
          items: items.map((i) => ({
            productName: i.productName,
            size: i.size,
            price: i.price,
            qty: i.qty,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Errore nell'invio dell'ordine");
        return;
      }

      const { url } = await res.json();
      // Redirect a Stripe Checkout
      window.location.href = url;
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-900 transition-colors";
  const labelCls = "block text-xs tracking-widest uppercase text-stone-500 mb-2";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      {/* Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
        <div className="bg-white p-6 space-y-5">
          <h2 className="font-medium text-stone-900 pb-4 border-b border-stone-100">
            Dati di contatto
          </h2>

          <div>
            <label className={labelCls}>Nome e cognome *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Mario Rossi"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="mario@email.it"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Telefono</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+39 333 1234567"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Indirizzo di spedizione *</label>
            <input
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Via Roma 1, 00100 Roma (RM)"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Note sull&apos;ordine</label>
            <textarea
              rows={3}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Istruzioni per la consegna, richieste speciali…"
              className={inputCls + " resize-none"}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-4 gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Procedi al pagamento →
        </button>

        <p className="text-xs text-stone-400 text-center leading-relaxed">
          Verrai reindirizzato alla pagina di pagamento sicura Stripe.
        </p>
      </form>

      {/* Order summary */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 space-y-4 sticky top-28">
          <h2 className="font-medium text-stone-900 pb-4 border-b border-stone-100">
            Riepilogo
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-3">
                <div className="relative w-14 h-14 flex-shrink-0 bg-stone-100">
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
                  <span className="absolute -top-1.5 -right-1.5 bg-stone-900 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                    {item.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{item.productName}</p>
                  <p className="text-xs text-stone-400">Misura: {item.size}</p>
                </div>
                <p className="text-sm font-medium text-stone-900 flex-shrink-0">
                  {formatPrice(item.price * item.qty)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-stone-500">
              <span>Subtotale</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-500">
              <span>Spedizione</span>
              <span>Da concordare</span>
            </div>
            <div className="flex justify-between font-medium text-stone-900 pt-2 border-t border-stone-100">
              <span>Totale</span>
              <span className="font-serif text-lg">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
