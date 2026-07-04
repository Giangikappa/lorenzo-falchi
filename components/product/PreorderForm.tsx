"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

interface Props {
  productId: string;
  productName: string;
}

export default function PreorderForm({ productId, productName }: Props) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", note: "" });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/preorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId }),
      });
      if (!res.ok) throw new Error();
      setState("success");
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="border border-gold/30 bg-gold/5 p-6 text-center">
        <div className="text-gold text-3xl mb-3">✓</div>
        <p className="font-serif text-lg text-stone-900 mb-1">
          Preordine registrato
        </p>
        <p className="text-sm text-stone-500">
          Ti contatteremo appena il prodotto sarà disponibile.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="space-y-4">
        <div className="border border-gold/30 bg-gold/5 p-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            <strong className="text-stone-900">Questo articolo è in pre-ordine.</strong>{" "}
            Lascia il tuo contatto e ti avviseremo appena sarà disponibile all&apos;acquisto.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="btn-gold w-full gap-2"
        >
          <Bell size={16} />
          Avvisami quando disponibile
        </button>
      </div>
    );
  }

  return (
    <div className="border border-stone-200 p-6 space-y-6">
      <div>
        <p className="label-small mb-1">Pre-ordine</p>
        <p className="text-sm text-stone-600">{productName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs tracking-widest uppercase text-stone-400 block mb-2">
              Nome *
            </label>
            <input
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Mario"
              className="input-base"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-stone-400 block mb-2">
              Cognome *
            </label>
            <input
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Rossi"
              className="input-base"
            />
          </div>
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-stone-400 block mb-2">
            Email *
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="la.tua@email.com"
            className="input-base"
          />
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-stone-400 block mb-2">
            Telefono
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+39 333 000 0000"
            className="input-base"
          />
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-stone-400 block mb-2">
            Note (opzionale)
          </label>
          <textarea
            rows={2}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Taglia preferita, domande..."
            className="input-base resize-none"
          />
        </div>

        {state === "error" && (
          <p className="text-red-500 text-xs">Errore. Riprova.</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="btn-outline flex-1 py-2"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={state === "loading"}
            className="btn-gold flex-1 py-2 disabled:opacity-60"
          >
            {state === "loading" ? "Invio..." : "Conferma"}
          </button>
        </div>
      </form>
    </div>
  );
}
