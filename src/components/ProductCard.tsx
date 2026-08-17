"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Photo from "./Photo";
import ColorDots from "./ColorDots";
import Icon from "./Icon";
import { fmt, toneFor } from "@/lib/data";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product: p }: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const router = useRouter();

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => router.push(`/producto/${p.id}`)}
      style={{
        cursor: "pointer", display: "flex", flexDirection: "column", gap: 12,
        background: "var(--surface)", borderRadius: "var(--radius)", padding: 12,
        boxShadow: hover ? "var(--shadow-hover)" : "var(--shadow)",
        transition: "box-shadow .2s ease, transform .2s ease",
        transform: hover ? "translateY(-3px)" : "none",
      }}
    >
      <div style={{
        position: "relative",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
      }}>
        <Photo src={p.image} alt={p.name} label={`foto · ${p.name}`} tone={toneFor(p)} round={0} />
        {p.badge && (
          <span style={{
            position: "absolute", top: 12, left: 12,
            font: "700 10px/1 var(--ui-font)", letterSpacing: ".08em", textTransform: "uppercase",
            color: "var(--ink)", background: "var(--surface)", padding: "6px 10px",
            borderRadius: 999, boxShadow: "0 2px 8px rgba(60,48,40,.12)",
          }}>
            {p.badge}
          </span>
        )}
        <button
          onClick={(e) => e.stopPropagation()}
          aria-label="Guardar"
          style={{
            position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: "50%",
            display: "grid", placeItems: "center", border: "none", cursor: "pointer",
            background: "color-mix(in srgb, var(--surface) 85%, transparent)", color: "var(--ink-soft)",
            opacity: hover ? 1 : 0, transition: "opacity .2s ease",
          }}
        >
          <Icon name="heart" size={17} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <h3 style={{ margin: 0, font: "var(--card-title-font)", color: "var(--ink)" }}>{p.name}</h3>
          <span style={{ font: "700 14px/1.5 var(--ui-font)", color: "var(--ink)", whiteSpace: "nowrap" }}>
            {fmt(p.price)}
          </span>
        </div>
        <p style={{ margin: 0, font: "400 13px/1.45 var(--ui-font)", color: "var(--ink-soft)" }}>{p.short}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <ColorDots colors={p.colors} />
          <span style={{ font: "500 11px/1 'IBM Plex Mono', monospace", color: "var(--muted)" }}>
            {p.fiber}
          </span>
        </div>
      </div>
    </article>
  );
}
