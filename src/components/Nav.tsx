"use client";

import { useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar el menú al cambiar de página
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  // Con el menú abierto no se scrollea la página de atrás
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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
            style={{ objectFit: "contain", width: "clamp(118px, 30vw, 150px)", height: "auto" }}
            priority
          />
        </Link>

        {/* Links (desktop) */}
        <nav className="nav-links" style={{ display: "flex", gap: 4, marginLeft: 18 }}>
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

        {/* Iconos derecha — buscar y favoritos todavía no hacen nada: en mobile no se muestran */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <button className="hide-mobile" style={ICON_BTN} aria-label="Buscar"><Icon name="search" /></button>
          <button className="hide-mobile" style={ICON_BTN} aria-label="Favoritos"><Icon name="heart" /></button>
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
          <button
            className="nav-burger"
            onClick={() => setMenuOpen((o) => !o)}
            style={ICON_BTN}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {/* Menú desplegable (mobile / tablet) */}
      <div
        className="nav-drawer"
        style={{
          position: "absolute", top: "100%", left: 0, right: 0, height: "calc(100dvh - 100%)",
          background: "var(--ink)",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          transform: menuOpen ? "none" : "translateY(-8px)",
          transition: "opacity .2s ease, transform .2s ease, visibility .2s",
          overflowY: "auto",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", padding: "12px var(--pad) 32px" }}>
          {LINKS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,.1)",
                  font: "500 26px/1 var(--head-fam)",
                  color: active ? "var(--accent)" : "var(--bg)",
                  textDecoration: "none",
                }}
              >
                {label}
                <Icon name="arrow" size={18} />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

const ICON_BTN: React.CSSProperties = {
  width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center",
  border: "none", background: "none", cursor: "pointer", color: "var(--bg)",
};
