import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, CATALOG_PRODUCTS } from "@/lib/data";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";
import ProductCard from "@/components/ProductCard";
import Icon from "@/components/Icon";

const STATS = [
  { n: "100%", l: "fibras naturales" },
  { n: "+1.200", l: "prendas tejidas" },
  { n: "2-3", l: "sem · por encargo" },
];

const CAT_TONES = ["caramel", "sage", "rosa"] as const;

// Fotos a modo de ejemplo — reemplazar por las definitivas de cada categoría.
const CAT_IMAGES = [
  "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832245/Amapola-18_hwzfix.jpg",
  "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832244/Amapola-38_sc6azn.jpg",
  "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832243/Amapola-01_hhy4yc.jpg",
];

const HANDMADE = [
  { icon: "hand" as const, title: "Hecho a mano", text: "Cada pieza lleva horas de trabajo paciente con dos agujas o en telar." },
  { icon: "leaf" as const, title: "Fibras nobles", text: "Lana merino, alpaca, algodón pima y lana de oveja sin teñir." },
  { icon: "truck" as const, title: "Envío gratis", text: "En pedidos desde $60.000 a todo el país." },
];

export default function Home() {
  const badged = CATALOG_PRODUCTS.filter((p) => p.badge);
  const featured = (badged.length > 0 ? badged : CATALOG_PRODUCTS).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section style={{ background: "var(--hero-bg)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{
          display: "grid", gridTemplateColumns: "1.05fr .95fr",
          gap: "clamp(28px,4vw,60px)", alignItems: "center",
          padding: "clamp(40px,7vw,96px) var(--pad)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 520 }}>
            <Eyebrow>Tejidos artesanales · desde 2019</Eyebrow>
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
              Sweaters, accesorios y mantas tejidos en lanas y algodones naturales. Para mujeres, niños y rincones de casa que piden calorcito.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/catalogo" style={BTN_SOLID}>
                Ver catálogo <Icon name="arrow" size={16} />
              </Link>
              <Link href="/catalogo/sweaters" style={BTN_OUTLINE}>
                Sweaters
              </Link>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 6 }}>
              {STATS.map(({ n, l }) => (
                <div key={l}>
                  <div style={{ font: "var(--stat-font)", color: "var(--ink)" }}>{n}</div>
                  <div style={{ font: "500 11px/1.3 'IBM Plex Mono', monospace", color: "var(--muted)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Foto hero + insignia */}
          <div style={{ position: "relative" }}>
            <Photo
              src="https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832245/Amapola-69_gzv6di.jpg"
              alt="Modelo con sweater tejido a mano"
              label="foto principal · modelo con sweater tejido"
              tone="blush"
              ratio="4 / 5"
            />
            <div style={{
              position: "absolute", bottom: -22, left: -22,
              width: 132, height: 132, borderRadius: "50%",
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
              Tres familias, un mismo telar
            </h2>
          </div>
          <Link href="/catalogo" style={LINK_BTN}>
            Ver todo <Icon name="arrow" size={15} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {CATEGORIES.map((c, i) => (
            <Link key={c.id} href={`/catalogo/${c.id}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 14 }}>
              <Photo
                src={CAT_IMAGES[i]}
                alt={c.label}
                label={`foto · ${c.label.toLowerCase()}`}
                tone={CAT_TONES[i]}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 280px))", gap: 24, justifyContent: "center" }}>
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* HECHO A MANO */}
      <section className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {HANDMADE.map(({ icon, title, text }) => (
            <div key={title} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{
                width: 48, height: 48, borderRadius: "var(--radius-sm)",
                background: "var(--bg-2)", display: "grid", placeItems: "center",
                color: "var(--accent)",
              }}>
                <Icon name={icon} size={22} />
              </span>
              <div>
                <h3 style={{ margin: "0 0 6px", font: "var(--h3-font)", color: "var(--ink)" }}>{title}</h3>
                <p style={{ margin: 0, font: "400 14px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>{text}</p>
              </div>
            </div>
          ))}
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
