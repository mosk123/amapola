"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { COLORS, fmt, getCrossSellProducts, getImages, toneFor, priceLabel } from "@/lib/data";
import Photo from "./Photo";
import Btn from "./Btn";
import Icon from "./Icon";


export default function CartDrawer() {
  const { items, cartOpen, closeCart, removeFromCart, subtotal } = useCart();
  const router = useRouter();

  const goToCatalog = () => { closeCart(); router.push("/catalogo"); };
  const goToCheckout = () => { closeCart(); router.push("/checkout"); };
  const goToProduct = (id: string) => { closeCart(); router.push(`/producto/${id}`); };

  const crossSell = getCrossSellProducts(items, 3);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: "fixed", inset: 0, zIndex: 60,
          background: "rgba(50,38,30,.32)",
          opacity: cartOpen ? 1 : 0,
          pointerEvents: cartOpen ? "auto" : "none",
          transition: "opacity .25s ease",
        }}
      />

      {/* Panel */}
      <aside style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 92vw)", zIndex: 70,
        background: "var(--bg)", boxShadow: "-20px 0 50px -20px rgba(50,38,30,.4)",
        transform: cartOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform .3s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 22px", borderBottom: "1px solid var(--line)",
        }}>
          <h2 style={{ margin: 0, font: "600 21px/1 var(--head-fam,'Caveat',cursive)", color: "var(--ink)" }}>
            Tu carrito
          </h2>
          <button onClick={closeCart} style={ICON_BTN}><Icon name="close" /></button>
        </div>

        {/* Vacío */}
        {items.length === 0 ? (
          <div style={{ flex: 1, display: "grid", placeContent: "center", textAlign: "center", gap: 14, padding: 30 }}>
            <span style={{ color: "var(--muted)", justifySelf: "center" }}>
              <Icon name="cart" size={40} stroke={1.2} />
            </span>
            <p style={{ margin: 0, font: "400 15px/1.5 var(--ui-font)", color: "var(--ink-soft)" }}>
              Tu carrito está vacío.<br />Date una vuelta por el telar.
            </p>
            <Btn onClick={goToCatalog}>Ver catálogo</Btn>
          </div>
        ) : (
          <>
            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 22px" }}>
              {items.map((it, idx) => (
                <div key={idx} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ width: 76, flexShrink: 0 }}>
                    <Photo src={getImages(it, it.color)[0]} alt={it.name} tone={toneFor(it)} ratio="4/5" round="var(--radius-sm)" />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <h3 style={{ margin: 0, font: "700 14px/1.2 var(--ui-font)", color: "var(--ink)" }}>{it.name}</h3>
                      <button onClick={() => removeFromCart(idx)} style={{ ...ICON_BTN, color: "var(--muted)" }} aria-label="Quitar">
                        <Icon name="close" size={15} />
                      </button>
                    </div>
                    <span style={{ font: "500 11px/1.3 'IBM Plex Mono', monospace", color: "var(--muted)" }}>
                      {COLORS[it.color]?.label} · talle {it.size}
                    </span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                      {/* Prendas únicas: sin selector de cantidad */}
                      <span style={{ font: "500 12px/1 var(--ui-font)", color: "var(--muted)" }}>Prenda única</span>
                      <span style={{ font: "700 14px/1 var(--ui-font)", color: "var(--ink)" }}>
                        {fmt(it.price * it.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Cross-sell */}
              {crossSell.length > 0 && (
                <div style={{ padding: "18px 0 6px" }}>
                  <p style={{ margin: "0 0 12px", font: "700 12px/1 var(--ui-font)", color: "var(--ink)" }}>
                    También te puede interesar
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {crossSell.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => goToProduct(p.id)}
                        style={{
                          display: "flex", flexDirection: "column", gap: 6,
                          border: "none", background: "none", padding: 0,
                          cursor: "pointer", textAlign: "left",
                        }}
                      >
                        <Photo src={getImages(p)[0]} alt={p.name} tone={toneFor(p)} ratio="1 / 1" round="var(--radius-sm)" />
                        <span style={{ font: "600 11px/1.25 var(--ui-font)", color: "var(--ink)" }}>{p.name}</span>
                        <span style={{ font: "700 11px/1 var(--ui-font)", color: "var(--accent)" }}>{priceLabel(p)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "18px 22px 24px", borderTop: "1px solid var(--line)", background: "var(--bg-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ font: "400 14px/1.4 var(--ui-font)", color: "var(--ink-soft)" }}>Subtotal</span>
                <span style={{ font: "700 18px/1 var(--ui-font)", color: "var(--ink)" }}>{fmt(subtotal)}</span>
              </div>
              <p style={{ margin: "0 0 14px", font: "500 11px/1.4 'IBM Plex Mono', monospace", color: "var(--muted)" }}>
                El envío se calcula en el checkout con tu código postal
              </p>
              <Btn full size="lg" onClick={goToCheckout}>Finalizar compra</Btn>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

const ICON_BTN: React.CSSProperties = {
  width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center",
  border: "none", background: "none", cursor: "pointer", color: "var(--ink)",
};

