import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cartContext";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "Lorenzo Falchi — Gioielli Artigianali",
    template: "%s | Lorenzo Falchi",
  },
  description:
    "Sono Lorenzo Falchi, orafo artigiano. Creo gioielli unici ispirati ai format social: pezzi esclusivi, edizioni limitate e creazioni su misura.",
  keywords: ["gioielli artigianali", "gioielli personalizzati", "Lorenzo Falchi", "handmade jewelry"],
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Lorenzo Falchi",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
