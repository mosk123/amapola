"use client";

import { useState } from "react";
import Link from "next/link";
import { COLORS, getRelatedProducts, fmt, toneFor } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import type { Product, ColorKey } from "@/types";
import Photo from "@/components/Photo";
import Btn from "@/components/Btn";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";

interface Props {
  product: Product;
}

const STARS = 5;

export default function ProductClient({ product: p }: Props) {
  const [color, setColor] = useState<ColorKey>(p.colors[0]);
  const [size, setSize] = useState(p.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const related = getRelatedProducts(p);

  const handleAdd = () => {
    addToCart(p, color, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div style={{ padding: "clamp(24px,4vw,48px) var(--pad)" }}>
      <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
        {/* Volver */}
        <Link
          href="/catalogo"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28,
            font: "600 13px/1 var(--ui-font)", color: "var(--ink-soft)", textDecoration: "none",
          }}
        >
          <Icon name="back" size={16} /> Volver al catálogo
        </Link>

        {/* Grid principal */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,4vw,60px)", alignItems: "start" }}>
          {/* Fotos */}
          <div style={{ position: "sticky", top: 92 }}>
            <Photo src={p.image} alt={p.name} label={`foto · ${p.name}`} tone={toneFor(p)} ratio="4 / 5" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 12 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{
                  borderRadius: "var(--radius-sm)", overflow: "hidden",
                  border: i === 0 ? "2px solid var(--accent)" : "2px solid transparent",
                  cursor: "pointer",
                }}>
                  <Photo label="" tone={toneFor(p)} ratio="1 / 1" round={0} />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <Eyebrow>{p.cat}</Eyebrow>
              {p.badge && (
                <span style={{
                  marginLeft: 10, font: "700 10px/1 var(--ui-font)", letterSpacing: ".08em",
                  textTransform: "uppercase", color: "var(--ink)", background: "var(--bg-2)",
                  padding: "5px 10px", borderRadius: 999,
                }}>
                  {p.badge}
                </span>
              )}
            </div>

            <h1 style={{
              margin: 0, font: "var(--h1-font)", color: "var(--ink)",
              textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
              letterSpacing: "var(--head-tracking)",
            }}>
              {p.name}
            </h1>

            {/* Precio + estrellas */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ font: "700 26px/1 var(--ui-font)", color: "var(--ink)" }}>{fmt(p.price)}</span>
              <div style={{ display: "flex", gap: 2, color: "var(--accent)" }}>
                {Array.from({ length: STARS }).map((_, i) => (
                  <Icon key={i} name="star" size={16} stroke={0} />
                ))}
              </div>
              <span style={{ font: "400 13px/1 var(--ui-font)", color: "var(--muted)" }}>(28 reseñas)</span>
            </div>

            <p style={{ margin: 0, font: "400 15px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>{p.desc}</p>

            {/* Color */}
            <div>
              <p style={{ margin: "0 0 10px", font: "600 13px/1 var(--ui-font)", color: "var(--ink)" }}>
                Color: <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>{COLORS[color]?.label}</span>
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {p.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    title={COLORS[c]?.label}
                    style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: COLORS[c]?.hex, border: "none", cursor: "pointer",
                      boxShadow: color === c
                        ? "0 0 0 2.5px var(--surface), 0 0 0 4px var(--ink)"
                        : "inset 0 0 0 1px rgba(0,0,0,.1)",
                      transition: "box-shadow .15s ease",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Talle */}
            <div>
              <p style={{ margin: "0 0 10px", font: "600 13px/1 var(--ui-font)", color: "var(--ink)" }}>Talle</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    style={{
                      padding: "9px 18px", borderRadius: "var(--btn-radius)",
                      border: `1.5px solid ${size === s ? "var(--ink)" : "var(--line-strong)"}`,
                      background: size === s ? "var(--ink)" : "var(--surface)",
                      color: size === s ? "var(--bg)" : "var(--ink)",
                      font: "600 13px/1 var(--ui-font)", cursor: "pointer",
                      transition: "all .15s ease",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad + Agregar */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                display: "flex", alignItems: "center",
                border: "1.5px solid var(--line-strong)", borderRadius: "var(--btn-radius)",
              }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={QTY_BTN}
                >
                  <Icon name="minus" size={16} />
                </button>
                <span style={{ width: 36, textAlign: "center", font: "700 15px/1 var(--ui-font)", color: "var(--ink)" }}>
                  {qty}
                </span>
                <button onClick={() => setQty((q) => q + 1)} style={QTY_BTN}>
                  <Icon name="plus" size={16} />
                </button>
              </div>

              <Btn size="lg" full onClick={handleAdd}>
                {added
                  ? <><Icon name="check" size={16} /> Agregado</>
                  : "Agregar al carrito"
                }
              </Btn>
            </div>

            {/* Detalles */}
            <div style={{
              padding: "18px 20px", borderRadius: "var(--radius)",
              border: "1px solid var(--line)", background: "var(--bg-2)",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {[
                ["leaf", `Fibra: ${p.fiber}`],
                ["hand", "Tejido a mano · 2-3 semanas por encargo"],
                ["truck", "Envío gratis desde $60.000"],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ color: "var(--accent)" }}><Icon name={icon as "leaf"} size={17} /></span>
                  <span style={{ font: "400 13px/1.4 var(--ui-font)", color: "var(--ink-soft)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <div style={{ marginTop: "clamp(48px,6vw,84px)" }}>
            <h2 style={{
              margin: "0 0 28px", font: "var(--h2-font)", color: "var(--ink)",
              textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
              letterSpacing: "var(--head-tracking)",
            }}>
              También tejimos
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {related.map((rp) => <ProductCard key={rp.id} product={rp} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const QTY_BTN: React.CSSProperties = {
  width: 40, height: 40, display: "grid", placeItems: "center",
  border: "none", background: "none", color: "var(--ink)", cursor: "pointer",
};
