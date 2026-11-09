"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { useCart } from "@/context/CartContext";
import { SOCIAL } from "@/lib/store-config";
import SearchPanel from "./SearchPanel";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [likeOpen, setLikeOpen] = useState(false);
  const likeRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al cambiar de página
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
    setLikeOpen(false);
  }

  // Con el menú abierto no se scrollea la página de atrás
  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  // El menú del corazón se cierra al tocar afuera o con Escape
  useEffect(() => {
    if (!likeOpen) return;
    const onClick = (e: MouseEvent) => { if (!likeRef.current?.contains(e.target as Node)) setLikeOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLikeOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [likeOpen]);

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

        {/* Iconos derecha: buscar, me gusta en redes, carrito */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <button
            onClick={() => { setSearchOpen((o) => !o); setMenuOpen(false); setLikeOpen(false); }}
            style={ICON_BTN}
            aria-label="Buscar"
            aria-expanded={searchOpen}
          >
            <Icon name="search" />
          </button>
          <div ref={likeRef} style={{ position: "relative" }}>
            <button
              onClick={() => setLikeOpen((o) => !o)}
              style={ICON_BTN}
              aria-label="Seguinos en redes"
              aria-expanded={likeOpen}
              aria-haspopup="true"
            >
              <Icon name="heart" />
            </button>
            {likeOpen && (
              <div role="menu" style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0, width: 230, zIndex: 50,
                background: "var(--surface)", borderRadius: "var(--radius-sm)",
                boxShadow: "var(--shadow-hover)", border: "1px solid var(--line)", padding: 8,
              }}>
                <p style={{ margin: "6px 10px 8px", font: "600 13px/1.3 var(--ui-font)", color: "var(--ink)" }}>
                  ¿Te gusta lo que hacemos? Seguinos
                </p>
                {[
                  { ...SOCIAL.instagram, icon: "instagram" as const },
                  { ...SOCIAL.facebook, icon: "facebook" as const },
                ].map((r) => (
                  <a
                    key={r.label}
                    role="menuitem"
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setLikeOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px",
                      borderRadius: 8, textDecoration: "none", color: "var(--ink)",
                      font: "600 14px/1 var(--ui-font)",
                    }}
                  >
                    <span style={{ color: "var(--accent)", display: "grid" }}><Icon name={r.icon} size={18} /></span>
                    {r.label}
                    <span style={{ marginLeft: "auto", font: "400 12px/1 var(--ui-font)", color: "var(--muted)" }}>{r.handle}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
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
            onClick={() => { setMenuOpen((o) => !o); setSearchOpen(false); setLikeOpen(false); }}
            style={ICON_BTN}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}

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
