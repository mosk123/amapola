"use client";

import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/data";

const TIENDA = [
  ...CATEGORIES.map((c) => ({ label: c.label, href: `/catalogo/${c.id}` })),
  { label: "Catálogo", href: "/catalogo" },
];

const AMAPOLA = [
  { label: "Nosotras", href: "/nosotras" },
  { label: "Las Tejedoras", href: "/nosotras" },
  { label: "Cuidados", href: "/cuidados" },
  { label: "Contacto", href: "/contacto" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--ink)", color: "var(--bg)", marginTop: 0 }}>
      <div className="wrap footer-grid" style={{ padding: "clamp(40px, 8vw, 56px) var(--pad) 40px" }}>
        {/* Marca */}
        <div>
          <Image
            src="/logo/wordmark-light.png"
            alt="Amapola Knitwear"
            width={112}
            height={36}
            style={{ objectFit: "contain", marginBottom: 12 }}
          />
          <p style={{ margin: 0, font: "400 14px/1.6 var(--ui-font)", opacity: .8, maxWidth: 280 }}>
            Tejidos artesanales para abrigar a quienes querés. Hecho a mano, con tiempo y lanas nobles.
          </p>
        </div>

        {/* Tienda */}
        <div>
          <div style={COL_HEADER}>Tienda</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {TIENDA.map(({ label, href }) => (
              <Link key={label} href={href} style={FOOTER_LINK}>{label}</Link>
            ))}
          </div>
        </div>

        {/* Amapola */}
        <div>
          <div style={COL_HEADER}>Amapola</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {AMAPOLA.map(({ label, href }) => (
              <Link key={label} href={href} style={FOOTER_LINK}>{label}</Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <div style={COL_HEADER}>Sumate al club</div>
          <p style={{ margin: "0 0 12px", font: "400 13px/1.5 var(--ui-font)", opacity: .8 }}>
            Novedades, encargos y un mimo de bienvenida.
          </p>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="tu@email.com"
              type="email"
              style={{
                flex: 1, minWidth: 0, padding: "11px 14px", borderRadius: "var(--btn-radius)",
                border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.08)",
                color: "var(--bg)", font: "400 13px/1 var(--ui-font)", outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "11px 18px", borderRadius: "var(--btn-radius)",
                background: "var(--accent)", color: "var(--accent-ink)",
                font: "700 13px/1 var(--ui-font)", border: "none", cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Unirme
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="wrap" style={{
        padding: "16px var(--pad)", borderTop: "1px solid rgba(255,255,255,.12)",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        font: "400 12px/1.4 var(--ui-font)", opacity: .6,
      }}>
        <span>© 2026 Amapola Tejidos Artesanales</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Hecho con cariño</span>
      </div>
    </footer>
  );
}

const COL_HEADER: React.CSSProperties = {
  font: "700 11px/1 var(--ui-font)", letterSpacing: ".14em",
  textTransform: "uppercase", opacity: .6, marginBottom: 16,
};

const FOOTER_LINK: React.CSSProperties = {
  color: "var(--bg)", opacity: .85,
  font: "400 14px/1 var(--ui-font)",
  textDecoration: "none",
};
