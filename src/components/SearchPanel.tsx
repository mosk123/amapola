"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATALOG_PRODUCTS, CATEGORIES, COLORS, fmt, getCover, getImages, toneFor, priceLabel } from "@/lib/data";
import Photo from "./Photo";
import Icon from "./Icon";

/** Sin tildes y en minúscula, para que "pantalon" encuentre "Pantalón". */
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Texto en el que se busca cada producto: nombre, categoría, colores y descripción corta
const INDEX = CATALOG_PRODUCTS.map((p) => ({
  product: p,
  text: norm([
    p.name,
    CATEGORIES.find((c) => c.id === p.cat)?.label ?? p.cat,
    ...p.colors.map((c) => COLORS[c]?.label ?? c),
    p.short,
  ].join(" ")),
}));

/** Buscador del menú: panel debajo del header con resultados al tipear. */
export default function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Todas las palabras tienen que aparecer (ej: "body cerezo")
  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return INDEX.filter(({ text }) => words.every((w) => text.includes(w))).map(({ product }) => product);
  }, [q]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", top: "100%", left: 0, right: 0, height: "calc(100dvh - 100%)",
        background: "color-mix(in srgb, var(--brand-plum) 35%, transparent)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)", boxShadow: "var(--shadow)" }}
      >
        <div className="wrap" style={{ padding: "16px var(--pad) 20px" }}>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (results[0]) go(`/producto/${results[0].id}`);
            }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "0 6px 0 16px", borderRadius: "var(--btn-radius)",
              border: "1.5px solid var(--line-strong)", background: "var(--surface)",
            }}
          >
            <span style={{ color: "var(--muted)", display: "grid" }}><Icon name="search" size={18} /></span>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar prendas, colores…"
              aria-label="Buscar"
              style={{
                flex: 1, minWidth: 0, padding: "13px 0", border: "none", outline: "none",
                background: "transparent", font: "400 15px/1 var(--ui-font)", color: "var(--ink)",
              }}
            />
            <button type="button" onClick={onClose} aria-label="Cerrar buscador" style={{
              width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer",
              display: "grid", placeItems: "center", background: "none", color: "var(--ink-soft)",
            }}>
              <Icon name="close" size={17} />
            </button>
          </form>

          {q.trim() && (
            <div style={{ marginTop: 14, maxHeight: "60dvh", overflowY: "auto" }}>
              {results.length === 0 ? (
                <p style={{ margin: "8px 4px", font: "400 14px/1.5 var(--ui-font)", color: "var(--ink-soft)" }}>
                  No encontramos prendas con “{q.trim()}”.{" "}
                  <Link href="/catalogo" onClick={onClose} style={{ color: "var(--accent)", fontWeight: 600 }}>Ver todo el catálogo</Link>
                </p>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/producto/${p.id}`}
                        onClick={onClose}
                        style={{
                          display: "flex", alignItems: "center", gap: 14, padding: 8,
                          borderRadius: "var(--radius-sm)", textDecoration: "none",
                        }}
                        className="search-result"
                      >
                        <div style={{ width: 52, flexShrink: 0 }}>
                          <Photo src={getCover(p)[0] ?? getImages(p, p.colors[0])[0]} alt="" tone={toneFor(p)} ratio="1 / 1" round="10px" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ font: "var(--card-title-font)", color: "var(--ink)" }}>{p.name}</div>
                          <div style={{ font: "400 12px/1.4 var(--ui-font)", color: "var(--muted)" }}>
                            {p.colors.map((c) => COLORS[c]?.label).join(" · ")}
                          </div>
                        </div>
                        <span style={{ font: "700 14px/1 var(--ui-font)", color: "var(--ink)", whiteSpace: "nowrap" }}>{priceLabel(p)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
