import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CheckoutForm from "@/components/cart/CheckoutForm";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-20 min-h-screen bg-stone-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <h1 className="font-serif text-3xl font-light text-stone-900 mb-10">
            Concludi l&apos;ordine
          </h1>
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
