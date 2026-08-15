"use client";

import { useState, useMemo } from "react";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import Eyebrow from "@/components/Eyebrow";
import ProductCard from "@/components/ProductCard";

type SortKey = "featured" | "price-asc" | "price-desc";

const AUDIENCES = ["Todos", "Mujer", "Niños", "Hogar"];

interface CatalogClientProps {
  initialCat?: string;
}

export default function CatalogClient({ initialCat }: CatalogClientProps) {
  const [cat, setCat] = useState(initialCat || "todo");
  const [aud, setAud] = useState("Todos");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = cat === "todo" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);
    if (aud !== "Todos") list = list.filter((p) => p.audience === aud);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "featured") list = [...list].sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    return list;
  }, [cat, aud, sort]);

  return (
    <div>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", padding: "clamp(32px,5vw,56px) var(--pad) 0" }}>
        <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Eyebrow>Catálogo</Eyebrow>
          <h1 style={{
            margin: "10px 0 24px", font: "var(--h1-font)", color: "var(--ink)",
            textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
            letterSpacing: "var(--head-tracking)",
          }}>
            Nuestra colección
          </h1>

          {/* Barra de filtros */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingBottom: 16 }}>
            {/* Categorías */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[{ id: "todo", label: "Todo" }, ...CATEGORIES].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  style={chip(cat === c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Público + orden */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {AUDIENCES.map((a) => (
                <button key={a} onClick={() => setAud(a)} style={chip(aud === a)}>{a}</button>
              ))}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                style={{
                  padding: "7px 12px", borderRadius: "var(--btn-radius)",
                  border: "1px solid var(--line-strong)", background: "var(--surface)",
                  font: "600 13px/1 var(--ui-font)", color: "var(--ink)",
                  cursor: "pointer", outline: "none",
                }}
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: menor → mayor</option>
                <option value="price-desc">Precio: mayor → menor</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="wrap" style={{ padding: "32px var(--pad) clamp(48px,6vw,84px)" }}>
        <p style={{ margin: "0 0 20px", font: "500 12px/1 'IBM Plex Mono', monospace", color: "var(--muted)" }}>
          {filtered.length} {filtered.length === 1 ? "prenda" : "prendas"}
        </p>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--ink-soft)", font: "400 15px/1.6 var(--ui-font)" }}>
            No hay prendas con esos filtros.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
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
