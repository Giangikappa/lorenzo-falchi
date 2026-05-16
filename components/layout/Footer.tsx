import Link from "next/link";
import { Instagram } from "lucide-react";
import NewsletterForm from "@/components/home/NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="font-serif text-2xl font-light text-white tracking-widest mb-4">
            LORENZO<br />
            <span className="text-gold">FALCHI</span>
          </div>
          <p className="text-sm leading-relaxed text-stone-500 max-w-xs">
            Creo gioielli artigianali unici, partendo dall&apos;ispirazione
            dei social e trasformandola in oro con le mie mani.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <span className="label-small text-stone-500">Navigazione</span>
          {[
            { href: "/shop", label: "Collezione" },
            { href: "/#about", label: "Chi sono" },
            { href: "/#custom", label: "Gioiello su misura" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-stone-400 hover:text-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <NewsletterForm />

        {/* Social & Contact */}
        <div className="flex flex-col gap-4">
          <span className="label-small text-stone-500">Seguimi</span>
          <a
            href="https://instagram.com/falchi_gioielli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-stone-400 hover:text-gold transition-colors"
          >
            <Instagram size={16} />
            @falchi_gioielli
          </a>
          <a
            href="https://tiktok.com/@falchigioielli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-stone-400 hover:text-gold transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
            </svg>
            @falchigioielli
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-stone-600">
          © {new Date().getFullYear()} Lorenzo Falchi. Tutti i diritti riservati.
        </p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-xs text-stone-600 hover:text-gold transition-colors">
            Privacy Policy
          </Link>
          <Link href="/termini" className="text-xs text-stone-600 hover:text-gold transition-colors">
            Termini e Condizioni
          </Link>
        </div>
      </div>
    </footer>
  );
}
