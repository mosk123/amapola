"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { CATEGORIES, CATALOG_PRODUCTS } from "@/lib/data";
import type { ColorKey, Product } from "@/types";
import Eyebrow from "@/components/Eyebrow";
import ProductCard from "@/components/ProductCard";
import Icon from "@/components/Icon";

type SortKey = "featured" | "price-asc" | "price-desc";

const AUDIENCES = ["Todos", "Clásico", "Colores", "Animales"];

// Botones de público (Todos / Clásico / Colores / Animales): apagados por ahora, se pueden volver a mostrar.
const SHOW_AUDIENCE_FILTERS = false;
// Estilo de fondo fijo mientras los botones de público están apagados ("Animales" = fondo con personajes).
const DEFAULT_BACKGROUND = "Animales";

// Categorías donde se muestra una card por cada color
const SPLIT_BY_COLOR_CATS = ["sweaters", "bodys", "conjuntos", "enteritos"];

const SORT_LABELS: Record<SortKey, string> = {
  "featured": "Destacados",
  "price-asc": "Precio: menor → mayor",
  "price-desc": "Precio: mayor → menor",
};

// Personajes del fondo "Animales"
const CHARACTERS = [
  { src: "/logo/characters/crab.png", top: "4%", left: "-3%", size: 130, rotate: -8 },
  { src: "/logo/characters/duck.png", top: "8%", left: "88%", size: 150, rotate: 6 },
  { src: "/logo/characters/bunny.png", top: "42%", left: "-4%", size: 140, rotate: 5 },
  { src: "/logo/characters/fish-2.png", top: "48%", left: "92%", size: 120, rotate: -10 },
  { src: "/logo/characters/fish-1.png", top: "78%", left: "2%", size: 100, rotate: 12 },
  { src: "/logo/characters/duck.png", top: "82%", left: "80%", size: 110, rotate: -6 },
];

interface CatalogClientProps {
  initialCat?: string;
}

export default function CatalogClient({ initialCat }: CatalogClientProps) {
  // Categorías elegidas en "Filtrar" (vacío = todas)
  const [cats, setCats] = useState<string[]>(
    initialCat && CATEGORIES.some((c) => c.id === initialCat) ? [initialCat] : [],
  );
  const [aud, setAud] = useState("Todos");
  const [sort, setSort] = useState<SortKey>("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // El menú de "Filtrar" se cierra al tocar afuera o con Escape
  useEffect(() => {
    if (!filterOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!filterRef.current?.contains(e.target as Node)) setFilterOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFilterOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [filterOpen]);

  const toggleCat = (id: string) =>
    setCats((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const background = SHOW_AUDIENCE_FILTERS ? aud : DEFAULT_BACKGROUND;

  const filtered = useMemo(() => {
    let list = cats.length === 0 ? CATALOG_PRODUCTS : CATALOG_PRODUCTS.filter((p) => cats.includes(p.cat));
    // "Colores" = prendas que se pueden elegir en más de un color; el resto filtra por audience
    if (aud === "Colores") list = list.filter((p) => p.colors.length > 1);
    else if (aud !== "Todos") list = list.filter((p) => p.audience === aud);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "featured") list = [...list].sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    return list;
  }, [cats, aud, sort]);

  // Una card por color en las categorías de SPLIT_BY_COLOR_CATS (siempre, también en "Todo"), o en "Colores"
  const cards = useMemo(
    () => filtered.flatMap((p): { product: Product; variant?: ColorKey }[] =>
      aud === "Colores" || SPLIT_BY_COLOR_CATS.includes(p.cat)
        ? p.colors.map((variant) => ({ product: p, variant }))
        : [{ product: p }],
    // Lo agotado va al final (se sigue viendo, pero primero lo que se puede comprar)
    ).sort((a, b) => Number(isSoldOutCard(a)) - Number(isSoldOutCard(b))),
    [filtered, aud],
  );

  return (
    <div>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", paddingTop: "clamp(32px,5vw,56px)" }}>
        {/* Mismo .wrap (y margen) que la grilla de abajo, así títulos, botones y cards arrancan en la misma línea */}
        <div className="wrap">
          <div className="center-desktop">
            <Eyebrow>Catálogo</Eyebrow>
          </div>
          <h1 className="center-desktop" style={{
            margin: "10px 0 24px", font: "var(--h1-font)", color: "var(--ink)",
            textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
            letterSpacing: "var(--head-tracking)",
          }}>
            Nuestra colección
          </h1>

          {/* Barra de filtros */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {/* Todo: limpia el filtro de categorías */}
              <button onClick={() => setCats([])} style={chip(cats.length === 0)}>Todo</button>

              {/* Orden — select nativo invisible encima de un chip: el chip mide lo que mide el texto elegido */}
              <label style={{ ...chip(false), position: "relative", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink)" }}>
                {SORT_LABELS[sort]}
                <Chevron />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  aria-label="Ordenar"
                  style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", font: "inherit" }}
                >
                  {Object.entries(SORT_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>
              </label>

              {/* Filtrar: menú con las categorías, se pueden elegir varias */}
              <div ref={filterRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setFilterOpen((o) => !o)}
                  aria-expanded={filterOpen}
                  aria-haspopup="true"
                  style={{
                    ...chip(cats.length > 0), display: "inline-flex", alignItems: "center", gap: 6,
                    color: cats.length > 0 ? "var(--accent-ink)" : "var(--ink)",
                  }}
                >
                  Filtrar{cats.length > 0 && ` (${cats.length})`}
                  <Chevron up={filterOpen} />
                </button>

                {filterOpen && (
                  <div
                    role="menu"
                    className="filter-menu"
                    style={{
                      position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 30,
                      width: 240, maxWidth: "calc(100vw - 2 * var(--pad))",
                      background: "var(--surface)", borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--line)", boxShadow: "var(--shadow-hover)",
                      padding: 8,
                    }}
                  >
                    <p style={{ margin: "6px 10px 8px", font: "700 11px/1 var(--ui-font)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)" }}>
                      Categorías
                    </p>
                    {CATEGORIES.map((c) => {
                      const on = cats.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          role="menuitemcheckbox"
                          aria-checked={on}
                          onClick={() => toggleCat(c.id)}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10,
                            padding: "10px", border: "none", borderRadius: 8, cursor: "pointer",
                            background: on ? "var(--bg-2)" : "transparent", textAlign: "left",
                            font: "600 14px/1 var(--ui-font)", color: "var(--ink)",
                          }}
                        >
                          <span style={{
                            width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                            display: "grid", placeItems: "center",
                            border: `1.5px solid ${on ? "var(--accent)" : "var(--line-strong)"}`,
                            background: on ? "var(--accent)" : "var(--surface)", color: "var(--accent-ink)",
                          }}>
                            {on && <Icon name="check" size={12} />}
                          </span>
                          {c.label}
                        </button>
                      );
                    })}
                    {cats.length > 0 && (
                      <button
                        onClick={() => setCats([])}
                        style={{
                          width: "100%", marginTop: 6, padding: "10px", borderRadius: 8,
                          border: "none", borderTop: "1px solid var(--line)", background: "none",
                          cursor: "pointer", textAlign: "left",
                          font: "600 13px/1 var(--ui-font)", color: "var(--accent)",
                        }}
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Público (apagado con SHOW_AUDIENCE_FILTERS) */}
            {SHOW_AUDIENCE_FILTERS && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {AUDIENCES.map((a) => (
                  <button key={a} onClick={() => setAud(a)} style={chip(aud === a)}>{a}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ background: background === "Colores" ? "var(--hero-bg)" : "var(--bg-2)", position: "relative", overflow: "hidden" }}>
        {background === "Animales" && CHARACTERS.map((c, i) => (
          <Image
            key={i}
            src={c.src}
            alt=""
            width={c.size}
            height={c.size}
            aria-hidden
            className="catalog-character"
            style={{
              position: "absolute", top: c.top, left: c.left,
              width: c.size, height: "auto", opacity: 0.5,
              transform: `rotate(${c.rotate}deg)`,
              pointerEvents: "none", zIndex: 0,
            }}
          />
        ))}
        <div className="wrap" style={{ padding: "32px var(--pad) clamp(48px,6vw,84px)", position: "relative", zIndex: 1 }}>
          <p style={{ margin: "0 0 20px", font: "500 12px/1 'IBM Plex Mono', monospace", color: "var(--muted)" }}>
            {cards.length} {cards.length === 1 ? "prenda" : "prendas"}
          </p>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--ink-soft)", font: "400 15px/1.6 var(--ui-font)" }}>
              No hay prendas con esos filtros.
            </div>
          ) : (
            <div className="grid-cards grid-cards--fill">
              {cards.map(({ product, variant }) => (
                <ProductCard key={`${product.id}-${variant ?? ""}`} product={product} variant={variant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Card agotada: su color está vendido, o (sin variante) todos los colores lo están. */
function isSoldOutCard({ product, variant }: { product: Product; variant?: ColorKey }) {
  const sold = product.soldOut ?? [];
  return variant ? sold.includes(variant) : product.colors.every((c) => sold.includes(c));
}

function Chevron({ up = false }: { up?: boolean }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden style={{ flexShrink: 0, transform: up ? "rotate(180deg)" : "none", transition: "transform .15s ease" }}>
      <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function chip(active: boolean): React.CSSProperties {
  return {
    padding: "7px 16px", borderRadius: "var(--btn-radius)",
    border: `1.5px solid ${active ? "var(--accent)" : "var(--line-strong)"}`,
    background: active ? "var(--accent)" : "var(--surface)",
    color: active ? "var(--accent-ink)" : "var(--ink-soft)",
    font: "600 13px/1 var(--ui-font)",
    cursor: "pointer", transition: "all .15s ease",
  };
}
