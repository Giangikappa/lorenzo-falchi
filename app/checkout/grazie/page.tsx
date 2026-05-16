import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle } from "lucide-react";
import CartClearer from "@/components/cart/CartClearer";

export const metadata = { title: "Pagamento completato" };

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-20 min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <CheckCircle size={56} className="mx-auto text-gold mb-6" />
          <h1 className="font-serif text-3xl font-light text-stone-900 mb-4">
            Pagamento completato!
          </h1>
          <p className="text-stone-500 leading-relaxed mb-8">
            Grazie per il tuo ordine. Riceverai una email di conferma a breve.
            Ti contatterò per aggiornarti sulla spedizione.
          </p>
          <Link href="/shop" className="btn-primary">
            Continua a sfogliare
          </Link>
          {/* Svuota il carrello lato client dopo il pagamento */}
          <CartClearer />
        </div>
      </main>
      <Footer />
    </>
  );
}
