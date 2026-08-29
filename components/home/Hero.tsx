"use client";

import Link from "next/link";

function pushEvent(name: string) {
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event: name });
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-900">
      {/* Background placeholder — sostituire con immagine reale */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0A0A0A_0%,#1a1a16_50%,#0f0e0a_100%)]" />

      {/* Decorative gold line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-px bg-gold opacity-60" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-px bg-gold opacity-60" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="label-small text-gold mb-6 tracking-[0.4em]">
          Artigiano Orafo
        </p>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight mb-6">
          Non imito.{" "}
          <em className="text-gold not-italic">Creo.</em>
        </h1>

        <p className="text-stone-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12">
          Gioielli su misura. Edizioni limitate. Rari perché unici.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="btn-gold" onClick={() => pushEvent("cta_esplora_collezione")}>
            Esplora la Collezione
          </Link>
          <a href="#custom" className="btn-outline border-stone-600 text-stone-300 hover:bg-white hover:text-stone-900" onClick={() => pushEvent("cta_crea_gioiello")}>
            Crea il tuo gioiello
          </a>
        </div>
      </div>
    </section>
  );
}
