export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KSSXZ3JZ');`}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KSSXZ3JZ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
