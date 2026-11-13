import Image from "next/image";
import { cld } from "@/lib/cloudinary";
import Link from "next/link";
// CATALOG_PRODUCTS: volver a importarlo si se reactivan los STATS
import { CATEGORIES } from "@/lib/data";
import { getCatalog } from "@/lib/catalog";
import type { ColorKey, Product } from "@/types";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";
import ProductCard from "@/components/ProductCard";
import Icon from "@/components/Icon";

// STATS del hero: ocultos por ahora. Para volver a mostrarlos, descomentar esto,
// el import de CATALOG_PRODUCTS y el bloque {/* STATS */} del hero.
// // El número de modelos sale del catálogo, así se actualiza solo al agregar o sacar productos
// const STATS = [
//   { n: "100%", l: "fibras naturales" },
//   { n: String(CATALOG_PRODUCTS.length), l: "modelos tejidos" },
//   { n: "Listo", l: "para enviar" },
// ];

const CAT_TONES = ["caramel", "sage", "rosa", "blush"] as const;

// Fotos en Cloudinary (amapola/productos/<carpeta>/).
const HERO_IMAGE = cld("portada/portada2.jpg");

// Una foto por categoría (las que no tienen muestran el placeholder)
const CAT_IMAGES: Record<string, string> = {
  sweaters:   cld("sweater/rosa-1.jpg"),
  remeras:    cld("remera/remeraVioleta-1.jpg"),
  pantalones: cld("pantalon/pantalon.jpg"),
  vestidos:   cld("vestido/vestido-1.jpg"),
  conjuntos:  cld("conjunto/conjunto-diseno-marino-1.jpg"),
  enteritos:  cld("body/azul-1.jpg"),
  cubrepanal: cld("cubrepanal/cubrepanal.jpg"),
  bodys:      cld("body/body-1.jpg"),
};

// "Prendas destacadas" del inicio: producto + color (variant) que se muestra en la card
const FEATURED: { id: string; variant?: ColorKey }[] = [
  { id: "conjunto-diseno", variant: "rojo" },
  { id: "remera-violeta" },
  { id: "enterito-hojitas", variant: "crudo" },
];

export default async function Home() {
  const catalog = await getCatalog();
  const featured = FEATURED.flatMap(({ id, variant }) => {
    const product = catalog.find((p) => p.id === id);
    return product && !product.hidden ? [{ product, variant }] : [];
  }) satisfies { product: Product; variant?: ColorKey }[];

  return (
    <div>
      {/* HERO */}
      <section style={{ background: "var(--hero-bg)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap split" style={{
          "--cols": "1.05fr .95fr", alignItems: "center",
          padding: "clamp(40px,7vw,96px) var(--pad)",
        } as React.CSSProperties}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 520 }}>
            <Eyebrow>Tejidos artesanales · desde 2026</Eyebrow>
            <h1 style={{
              margin: "0 0 8px", font: "var(--h1-font)", color: "var(--ink)",
              textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
              letterSpacing: "var(--head-tracking)",
            }}>
              Abrigo tejido a mano,<br />
              <em style={{ fontStyle: "var(--em-style)", color: "var(--accent)" }}>
                una pieza a la vez
              </em>
            </h1>
            <p style={{ margin: 0, font: "400 17px/1.6 var(--ui-font)", color: "var(--ink-soft)", maxWidth: 440 }}>
              Sweaters, remeras, conjuntos y bodys tejidos en lanas y algodones naturales. Para niños y rincones de la casa que piden calorcito.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/catalogo" style={BTN_SOLID}>
                Ver catálogo <Icon name="arrow" size={16} />
              </Link>
              <Link href="/catalogo/sweaters" style={BTN_OUTLINE}>
                Sweaters
              </Link>
            </div>
            {/* STATS (ocultos por ahora)
            <div style={{ display: "flex", gap: 24, marginTop: 6 }}>
              {STATS.map(({ n, l }) => (
                <div key={l}>
                  <div style={{ font: "var(--stat-font)", color: "var(--ink)" }}>{n}</div>
                  <div style={{ font: "500 11px/1.3 'IBM Plex Mono', monospace", color: "var(--muted)" }}>{l}</div>
                </div>
              ))}
            </div>
            */}
          </div>

          {/* Foto hero + insignia */}
          <div style={{ position: "relative" }}>
            <Photo
              src={HERO_IMAGE}
              alt="Prendas tejidas a mano"
              label="foto principal · modelo con sweater tejido"
              tone="blush"
              ratio="4 / 5"
            />
            <div style={{
              position: "absolute", bottom: -22, left: "clamp(-22px, -2vw, 12px)",
              width: "clamp(96px, 26vw, 132px)", height: "clamp(96px, 26vw, 132px)", borderRadius: "50%",
              background: "var(--surface)", boxShadow: "var(--shadow)",
              display: "grid", placeItems: "center", padding: 12,
            }}>
              <Image src="/logo/isotipo-color.png" alt="Amapola" width={106} height={90} style={{ objectFit: "contain" }} />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <Eyebrow>Qué tejemos</Eyebrow>
            <h2 style={{
              margin: "10px 0 0", font: "var(--h2-font)", color: "var(--ink)",
              textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
              letterSpacing: "var(--head-tracking)",
            }}>
              Todo lo que tejemos
            </h2>
          </div>
          <Link href="/catalogo" style={LINK_BTN}>
            Ver todo <Icon name="arrow" size={15} />
          </Link>
        </div>
        <div className="grid-n2 carousel-mobile" style={{ "--n": 4 } as React.CSSProperties}>
          {CATEGORIES.map((c, i) => (
            <Link key={c.id} href={`/catalogo/${c.id}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 14 }}>
              <Photo
                src={CAT_IMAGES[c.id]}
                alt={c.label}
                label={`foto · ${c.label.toLowerCase()}`}
                tone={CAT_TONES[i % CAT_TONES.length]}
                ratio="3 / 4"
              />
              <div>
                <h3 style={{ margin: "0 0 4px", font: "var(--h3-font)", color: "var(--ink)" }}>{c.label}</h3>
                <p style={{ margin: 0, font: "400 13px/1.45 var(--ui-font)", color: "var(--ink-soft)" }}>{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <Eyebrow>Lo más querido</Eyebrow>
            <h2 style={{
              margin: "10px 0 0", font: "var(--h2-font)", color: "var(--ink)",
              textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
              letterSpacing: "var(--head-tracking)",
            }}>
              Prendas destacadas
            </h2>
          </div>
          <div className="grid-cards">
            {featured.map(({ product, variant }) => (
              <ProductCard key={`${product.id}-${variant ?? ""}`} product={product} variant={variant} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const BTN_SOLID: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 9,
  padding: "16px 32px", borderRadius: "var(--btn-radius)",
  background: "var(--accent)", color: "var(--accent-ink)",
  font: "700 14px/1 var(--ui-font)", letterSpacing: ".02em",
  textDecoration: "none", border: "1.5px solid var(--accent)",
};

const BTN_OUTLINE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 9,
  padding: "16px 32px", borderRadius: "var(--btn-radius)",
  background: "transparent", color: "var(--ink)",
  font: "700 14px/1 var(--ui-font)", letterSpacing: ".02em",
  textDecoration: "none", border: "1.5px solid var(--line-strong)",
};

const LINK_BTN: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  font: "600 14px/1 var(--ui-font)", color: "var(--ink-soft)",
  textDecoration: "none",
};
