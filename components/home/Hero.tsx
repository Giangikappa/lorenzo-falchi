import Link from "next/link";

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
          Il gioiello nasce
          <br />
          <em className="text-gold not-italic">dalla storia</em>
          <br />
          che racconti
        </h1>

        <p className="text-stone-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12">
          Osservo quello che infiamma i social e lo trasformo in oro.
          Ogni mio pezzo porta con sé un momento, un&apos;emozione, una tendenza
          che diventa qualcosa che puoi indossare per sempre.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="btn-gold">
            Esplora la Collezione
          </Link>
          <a href="#custom" className="btn-outline border-stone-600 text-stone-300 hover:bg-white hover:text-stone-900">
            Crea il tuo gioiello
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs tracking-widest uppercase text-stone-600">scroll</span>
          <div className="w-px h-8 bg-stone-700" />
        </div>
      </div>
    </section>
  );
}
