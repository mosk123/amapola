"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { useCart } from "@/context/CartContext";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotras", label: "Nosotras" },
  { href: "/cuidados", label: "Cuidados" },
  { href: "/contacto", label: "Contacto" },
];

export default function Nav() {
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      background: "color-mix(in srgb, var(--ink) 92%, transparent)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(255,255,255,.12)",
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px var(--pad)" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image
            src="/logo/wordmark-light.png"
            alt="Amapola Knitwear"
            width={150}
            height={48}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>

        {/* Links */}
        <nav style={{ display: "flex", gap: 4, marginLeft: 18 }}>
          {LINKS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  font: "600 14px/1 var(--ui-font)",
                  padding: "8px 14px",
                  borderRadius: "var(--btn-radius)",
                  color: active ? "var(--bg)" : "rgba(255,255,255,.7)",
                  textDecorationLine: active ? "underline" : "none",
                  textUnderlineOffset: 6,
                  textDecorationColor: "var(--accent)",
                  textDecorationThickness: 2,
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Iconos derecha */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <button style={ICON_BTN} aria-label="Buscar"><Icon name="search" /></button>
          <button style={ICON_BTN} aria-label="Favoritos"><Icon name="heart" /></button>
          <button
            onClick={openCart}
            style={{ ...ICON_BTN, position: "relative" }}
            aria-label="Carrito"
          >
            <Icon name="cart" />
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: 2, right: 2, minWidth: 17, height: 17, padding: "0 4px",
                borderRadius: 999, background: "var(--accent)", color: "var(--accent-ink)",
                font: "700 10px/17px var(--ui-font)", textAlign: "center",
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

const ICON_BTN: React.CSSProperties = {
  width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center",
  border: "none", background: "none", cursor: "pointer", color: "var(--bg)",
};
