import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { getCatalog } from "@/lib/catalog";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

// Fuentes incluidas en el proyecto (paquetes @fontsource), sin bajarlas de Google al compilar:
// el servidor de build de Hostinger no llega a fonts.googleapis.com.
const nunito = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/nunito-sans/files/nunito-sans-latin-wght-normal.woff2", weight: "200 1000", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/nunito-sans/files/nunito-sans-latin-wght-italic.woff2", weight: "200 1000", style: "italic" },
  ],
  variable: "--font-nunito",
  display: "swap",
});

const ibmMono = localFont({
  src: [
    { path: "../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

// Fallback manuscrito si "Dreaming Outloud Sans" no carga.
const caveat = localFont({
  src: "../../node_modules/@fontsource-variable/caveat/files/caveat-latin-wght-normal.woff2",
  weight: "400 700",
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
