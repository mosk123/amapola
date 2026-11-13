import type { Metadata } from "next";
import { Nunito_Sans, IBM_Plex_Mono, Caveat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { getCatalog } from "@/lib/catalog";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-nunito",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Fallback manuscrito si "Dreaming Outloud Sans" no carga.
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

// Fuente oficial de la identidad — usada en títulos (h1/h2/h3).
const dreamingOutloud = localFont({
  src: "../fonts/dreaming-outloud-regular.otf",
  variable: "--font-dreaming",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amapola — Tejidos Artesanales",
  description: "Sweaters, remeras, conjuntos y bodys tejidos a mano con lanas y algodones naturales. Para niños y el hogar.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Catálogo (Supabase) disponible para los componentes del cliente: buscador, catálogo, carrito
  const catalog = (await getCatalog()).filter((p) => !p.hidden);
  return (
    <html lang="es" className={`${nunito.variable} ${ibmMono.variable} ${caveat.variable} ${dreamingOutloud.variable}`}>
      <body>
        <CatalogProvider products={catalog}>
        <CartProvider>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Nav />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
            <CartDrawer />
          </div>
        </CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
