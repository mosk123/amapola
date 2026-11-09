"use client";

import { useState } from "react";
import Link from "next/link";
import { COLORS, availableSizes, getCover, getImages, getRelatedProducts, fmt, toneFor } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import type { Product, ColorKey } from "@/types";
import Photo from "@/components/Photo";
import Btn from "@/components/Btn";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";
import SizeGuide from "@/components/SizeGuide";

interface Props {
  product: Product;
  initialColor?: ColorKey;
}

// Va en todos los productos; debajo se agrega la composición de cada uno
const DESCRIPCION_FIJA = "Prenda realizada a mano con agujas circulares.";

export default function ProductClient({ product: p, initialColor }: Props) {
  // Con portada (cover) arranca sin color elegido mostrando la portada; al elegir color se pasa a sus fotos
  const [color, setColor] = useState<ColorKey | null>(initialColor ?? (p.cover ? null : p.colors[0]));
  const [photo, setPhoto] = useState(0);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const { addToCart } = useCart();

  // Talles con stock para el color elegido; si el talle elegido no está, pasa al primero que haya
  const avail = availableSizes(p, color);
  const currentSize = size && avail.includes(size) ? size : avail[0];
  // Conjuntos: talle fijo de cada pieza
  const pieces = color ? p.pieces?.[color] : undefined;
  // Agotado = color vendido (cartel en la foto); sin stock = ese color no tiene ningún talle
  const isSoldOut = !!color && !!p.soldOut?.includes(color);
  const soldOut = isSoldOut || (!!color && !pieces && avail.length === 0);
  const cartSize = pieces ? pieces.map((pc) => `${pc.name} ${pc.size}`).join(" · ") : currentSize;

  // Guía de talles: resalta el talle elegido (o el de cada pieza en conjuntos)
  const guideHighlight: Record<string, string | undefined> = pieces
    ? Object.fromEntries(pieces.map((pc) => [pc.name, pc.size]))
    : Object.fromEntries((p.measures ?? []).map((t) => [t.title ?? "", currentSize]));
  const guideLink = p.measures?.length ? (
    <button onClick={() => setGuideOpen(true)} style={GUIDE_LINK}>Ver guía de talles</button>
  ) : null;

  const related = getRelatedProducts(p);
  const images = color ? getImages(p, color) : getCover(p);
  const mainImage = images[photo] ?? images[0];
  const step = (d: number) => setPhoto((i) => (i + d + images.length) % images.length);

  const selectColor = (c: ColorKey) => {
    setColor(c);
    setPhoto(0); // cada color arranca por su primera foto
  };

  const handleAdd = () => {
    if (!color || soldOut || !cartSize) return;
    addToCart(p, color, cartSize);
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
        <div className="split" style={{ alignItems: "start" }}>
          {/* Fotos */}
          <div className="sticky-desktop">
            <Photo key={mainImage} src={mainImage} alt={color ? `${p.name} · ${COLORS[color]?.label}` : p.name} label={`foto · ${p.name}`} tone={toneFor(p)} ratio="4 / 5">
              {images.length > 1 && (
                <>
                  <button onClick={() => step(-1)} aria-label="Foto anterior" style={{ ...ARROW_BTN, left: 12 }}>
                    <Icon name="back" size={18} />
                  </button>
                  <button onClick={() => step(1)} aria-label="Foto siguiente" style={{ ...ARROW_BTN, right: 12 }}>
                    <Icon name="arrow" size={18} />
                  </button>
                  <span style={{
                    position: "absolute", bottom: 12, right: 12,
                    font: "600 11px/1 var(--ui-font)", color: "var(--ink)",
                    background: "color-mix(in srgb, var(--surface) 85%, transparent)",
                    padding: "6px 10px", borderRadius: 999,
                  }}>
                    {photo + 1} / {images.length}
                  </span>
                </>
              )}
              {isSoldOut && (
                <span aria-label="Agotado" style={{
                  position: "absolute", top: 30, right: -46, width: 190, transform: "rotate(45deg)",
                  padding: "9px 0", textAlign: "center", pointerEvents: "none",
                  background: "var(--ink)", color: "var(--bg)",
                  font: "700 12px/1 var(--ui-font)", letterSpacing: ".18em", textTransform: "uppercase",
                  boxShadow: "0 4px 12px rgba(60,48,40,.25)",
                }}>
                  Agotado
                </span>
              )}
            </Photo>
            {images.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 12 }}>
                {images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setPhoto(i)}
                    aria-label={`Ver foto ${i + 1}`}
                    style={{
                      padding: 0, background: "none",
                      borderRadius: "var(--radius-sm)", overflow: "hidden",
                      border: i === photo ? "2px solid var(--accent)" : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  >
                    <Photo src={src} alt="" tone={toneFor(p)} ratio="1 / 1" round={0} />
                  </button>
                ))}
              </div>
            )}
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

            <span style={{ font: "700 26px/1 var(--ui-font)", color: "var(--ink)" }}>{fmt(p.price)}</span>

            {/* Descripción: texto fijo + composición (grosor del hilo) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <p style={{ margin: 0, font: "400 15px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>{DESCRIPCION_FIJA}</p>
              {p.composition && (
                <p style={{ margin: 0, font: "400 15px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>
                  <strong style={{ fontWeight: 600, color: "var(--ink)" }}>Composición:</strong> {p.composition}
                </p>
              )}
            </div>

            {/* Color */}
            <div>
              <p style={{ margin: "0 0 10px", font: "600 13px/1 var(--ui-font)", color: "var(--ink)" }}>
                Color: <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>{color ? COLORS[color]?.label : "elegí uno"}</span>
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {p.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => selectColor(c)}
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

            {/* Talle — en conjuntos, el talle de cada pieza */}
            {pieces ? (
              <div>
                <div style={LABEL_ROW}>
                  <p style={{ margin: 0, font: "600 13px/1 var(--ui-font)", color: "var(--ink)" }}>Talles del conjunto</p>
                  {guideLink}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {pieces.map((pc) => (
                    <span key={pc.name} style={{
                      padding: "9px 16px", borderRadius: "var(--btn-radius)",
                      border: "1.5px solid var(--line-strong)", background: "var(--surface)",
                      font: "600 13px/1 var(--ui-font)", color: "var(--ink)",
                    }}>
                      {pc.name} <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>· {pc.size}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={LABEL_ROW}>
                  <p style={{ margin: 0, font: "600 13px/1 var(--ui-font)", color: "var(--ink)" }}>
                    Talle{soldOut && !isSoldOut && <span style={{ color: "var(--muted)", fontWeight: 400 }}> · sin stock en este color</span>}
                  </p>
                  {guideLink}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {p.sizes.map((s) => {
                    const ok = avail.includes(s);
                    const on = ok && currentSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        disabled={!ok}
                        title={ok ? undefined : "Sin stock"}
                        style={{
                          padding: "9px 18px", borderRadius: "var(--btn-radius)",
                          border: `1.5px solid ${on ? "var(--ink)" : "var(--line-strong)"}`,
                          background: on ? "var(--ink)" : ok ? "var(--surface)" : "transparent",
                          color: on ? "var(--bg)" : ok ? "var(--ink)" : "var(--muted)",
                          textDecoration: ok ? "none" : "line-through",
                          opacity: ok ? 1 : 0.55,
                          font: "600 13px/1 var(--ui-font)", cursor: ok ? "pointer" : "not-allowed",
                          transition: "all .15s ease",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cantidad + Agregar */}
            <div className="buy-bar" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                display: "flex", alignItems: "center", flexShrink: 0,
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

              <Btn size="lg" full onClick={handleAdd} disabled={!color || soldOut}>
                {added
                  ? <><Icon name="check" size={16} /> Agregado</>
                  : !color ? "Elegí un color" : isSoldOut ? "Agotado" : soldOut ? "Sin stock" : "Agregar al carrito"
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
            <div className="grid-cards">
              {related.map((rp) => <ProductCard key={rp.id} product={rp} />)}
            </div>
          </div>
        )}
      </div>

      {p.measures && (
        <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} tables={p.measures} highlight={guideHighlight} />
      )}
    </div>
  );
}

const ARROW_BTN: React.CSSProperties = {
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center",
  border: "none", cursor: "pointer", color: "var(--ink)",
  background: "color-mix(in srgb, var(--surface) 85%, transparent)",
  boxShadow: "0 2px 8px rgba(60,48,40,.15)",
};

const QTY_BTN: React.CSSProperties = {
  width: 40, height: 40, display: "grid", placeItems: "center",
  border: "none", background: "none", color: "var(--ink)", cursor: "pointer",
};

const LABEL_ROW: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 10,
};

const GUIDE_LINK: React.CSSProperties = {
  padding: 0, border: "none", background: "none", cursor: "pointer",
  font: "600 12px/1 var(--ui-font)", color: "var(--ink-soft)",
  textDecoration: "underline", textUnderlineOffset: 3,
};
