"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "Iscritto con successo!");
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ event: "newsletter_signup" });
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Errore. Riprova.");
      }
    } catch {
      setStatus("error");
      setMessage("Errore di rete. Riprova.");
    }
  };

  return (
    <div>
      <span className="label-small text-stone-500 block mb-4">Newsletter</span>
      <p className="text-sm text-stone-500 mb-4 leading-relaxed">
        Ricevi in anteprima le nuove collezioni e i pezzi in edizione limitata.
      </p>

      {status === "success" ? (
        <p className="text-sm text-gold">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="La tua email"
            className="bg-stone-800 border border-stone-700 text-stone-200 placeholder-stone-500 px-4 py-2.5 text-sm outline-none focus:border-gold transition-colors w-full"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary py-2.5 text-sm justify-center disabled:opacity-60 flex items-center gap-2"
          >
            {status === "loading" && <Loader2 size={14} className="animate-spin" />}
            Iscriviti
          </button>
          {status === "error" && (
            <p className="text-xs text-red-400">{message}</p>
          )}
        </form>
      )}
    </div>
  );
}
