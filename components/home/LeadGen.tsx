"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function LeadGen() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "home" }),
      });
      if (!res.ok) throw new Error();
      setState("success");
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "generate_lead" });
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "generate_lead" });
    } catch {
      setState("error");
    }
  };

  const inputClass = "w-full border-b border-stone-600 bg-transparent pb-3 text-sm text-white placeholder-stone-600 outline-none focus:border-gold transition-colors";

  return (
    <section id="custom" className="py-24 px-6 lg:px-12 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <p className="label-small text-gold mb-4 tracking-[0.3em]">Su misura</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-6">
            Il gioiello che hai in testa<br />
            <em className="text-gold not-italic">esiste già.</em><br />
            Lasciami crearlo.
          </h2>
          <p className="text-stone-400 leading-relaxed max-w-md">
            Hai un&apos;idea, un&apos;emozione, un&apos;immagine in mente? Mandamela.
            Trasformo ogni input — anche un semplice screenshot da Instagram —
            in un gioiello unico fatto apposta per te.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Consulenza gratuita",
              "Progetto e bozzetto inclusi",
              "Tempi di realizzazione personalizzati",
              "Spedizione in tutta Italia",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                <span className="text-sm text-stone-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-stone-800/50 p-8 lg:p-10">
          {state === "success" ? (
            <div className="text-center py-12">
              <div className="text-gold font-serif text-5xl mb-4">✓</div>
              <h3 className="font-serif text-2xl text-white mb-2">Richiesta inviata</h3>
              <p className="text-stone-400 text-sm">
                Ti rispondo entro 24 ore.
              </p>
              <button
                className="mt-8 text-xs tracking-widest uppercase text-gold hover:underline"
                onClick={() => setState("idle")}
              >
                Invia un&apos;altra richiesta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-400 block mb-2">
                    Nome *
                  </label>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    placeholder="Mario"
                    className={inputClass}
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
                    className={inputClass}
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
                  className={inputClass}
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
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-stone-400 block mb-2">
                  Descrivi il tuo gioiello
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Raccontami la tua idea, o il social format che ti ha ispirato..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {state === "error" && (
                <p className="text-red-400 text-xs">
                  Qualcosa è andato storto. Riprova o contattami direttamente.
                </p>
              )}

              <button
                type="submit"
                disabled={state === "loading"}
                className="btn-gold w-full gap-2 disabled:opacity-60"
              >
                {state === "loading" ? "Invio..." : (
                  <>
                    <Send size={15} />
                    Invia la richiesta
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
