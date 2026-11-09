"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Photo from "./Photo";
import ColorDots from "./ColorDots";
import Icon from "./Icon";
import { COLORS, fmt, getCover, getImages, toneFor } from "@/lib/data";
import type { ColorKey, Product } from "@/types";

interface ProductCardProps {
  product: Product;
  /** Card de una variante: arranca en ese color (sin portada) y lo muestra en el título. */
  variant?: ColorKey;
}

export default function ProductCard({ product: p, variant }: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const [color, setColor] = useState<ColorKey>(variant ?? p.colors[0]);
  // Con portada, la card la muestra hasta que se elige un color
  const [colorPicked, setColorPicked] = useState(!!variant);
  const router = useRouter();

  const showCover = !!p.cover && !colorPicked;
  const image = showCover ? getCover(p)[0] : getImages(p, color)[0];
  // Agotado: el color de la card está vendido (o todos, si todavía no se eligió color)
  const sold = p.soldOut ?? [];
  const soldOut = showCover ? p.colors.every((c) => sold.includes(c)) : sold.includes(color);

  const selectColor = (c: ColorKey) => {
    setColor(c);
    setColorPicked(true);
  };

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => router.push(showCover ? `/producto/${p.id}` : `/producto/${p.id}?color=${color}`)}
      className="pcard"
      style={{
        cursor: "pointer", display: "flex", flexDirection: "column", minWidth: 0,
        background: "var(--surface)", borderRadius: "var(--radius)",
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
        <Photo src={image} alt={p.name} label={`foto · ${p.name}`} tone={toneFor(p)} round={0} />
        {(soldOut || p.badge) && (
          <span style={{
            position: "absolute", top: 12, left: 12,
            font: "700 10px/1 var(--ui-font)", letterSpacing: ".08em", textTransform: "uppercase",
            color: soldOut ? "var(--bg)" : "var(--ink)",
            background: soldOut ? "var(--ink)" : "var(--surface)", padding: "6px 10px",
            borderRadius: 999, boxShadow: "0 2px 8px rgba(60,48,40,.12)",
          }}>
            {soldOut ? "Agotado" : p.badge}
          </span>
        )}
        <button
          className="hide-mobile"
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
        <div className="pcard-head">
          <h3 className="pcard-title" style={{ margin: 0, color: "var(--ink)" }}>
            {p.name}{variant && ` · ${COLORS[color]?.label}`}
          </h3>
          <span style={{ font: "700 14px/1.5 var(--ui-font)", color: "var(--ink)", whiteSpace: "nowrap" }}>
            {fmt(p.price)}
          </span>
        </div>
        <p className="hide-mobile" style={{ margin: 0, font: "400 13px/1.45 var(--ui-font)", color: "var(--ink-soft)" }}>{p.short}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <ColorDots colors={p.colors} selected={p.colors.length > 1 && !showCover ? color : undefined} onSelect={selectColor} />
          <span className="hide-mobile" style={{ font: "500 11px/1 'IBM Plex Mono', monospace", color: "var(--muted)" }}>
            {p.fiber}
          </span>
        </div>
      </div>
    </article>
  );
}
