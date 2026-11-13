"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { SHIPPING_OPTIONS, shippingFor, type ShippingMethod } from "@/lib/shipping";
import { COLORS, fmt } from "@/lib/data";
import { TRANSFER_DISCOUNT_RATE } from "@/lib/store-config";
import Eyebrow from "@/components/Eyebrow";
import Btn from "@/components/Btn";
import Icon from "@/components/Icon";

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

const EMPTY_FORM: CheckoutForm = {
  name: "", email: "", phone: "",
  street: "", city: "", province: "", postalCode: "",
};

type PaymentMethod = "mercadopago" | "transferencia";
type Step = "checkout" | "confirmar-transferencia";

const PAYMENT_METHODS: { id: PaymentMethod; icon: Parameters<typeof Icon>[0]["name"]; title: string; description: string; badge?: string }[] = [
  { id: "mercadopago", icon: "cart", title: "Mercado Pago", description: "Tarjetas, dinero en cuenta y más." },
  { id: "transferencia", icon: "box", title: "Transferencia bancaria", description: "Te pasamos el alias y coordinamos por WhatsApp.", badge: "10% OFF" },
];

export default function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<Step>("checkout");
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [submitNote, setSubmitNote] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const shipping = shippingMethod ? shippingFor(shippingMethod) : null;

  const requiredFieldsFilled = Object.values(form).every((v) => v.trim().length > 0);
  const canContinue = requiredFieldsFilled && shipping !== null && paymentMethod !== null;
  const discount = paymentMethod === "transferencia" ? Math.round(subtotal * TRANSFER_DISCOUNT_RATE) : 0;
  const total = subtotal - discount + (shipping?.cost ?? 0);

  const handlePayMercadoPago = async () => {
    setSubmitting(true);
    setSubmitNote(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((it) => ({ id: it.id, color: it.color, size: it.size, qty: it.qty })),
          contact: form,
          shippingMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.init_point) {
        throw new Error(data.error || "No pudimos iniciar el pago.");
      }
      window.location.href = data.init_point;
    } catch (err) {
      setSubmitNote(err instanceof Error ? err.message : "No pudimos iniciar el pago. Probá de nuevo.");
      setSubmitting(false);
    }
  };

  const handleConfirmTransferencia = async () => {
    setSubmitting(true);
    setSubmitNote(null);
    try {
      const res = await fetch("/api/checkout/transferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((it) => ({ id: it.id, color: it.color, size: it.size, qty: it.qty })),
          contact: form,
          shippingMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No pudimos registrar el pedido.");
      }
      clearCart();
      router.push(`/checkout/transferencia-confirmado?orderId=${encodeURIComponent(data.orderId)}`);
    } catch (err) {
      setSubmitNote(err instanceof Error ? err.message : "No pudimos registrar el pedido. Probá de nuevo.");
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (paymentMethod === "mercadopago") {
      handlePayMercadoPago();
    } else if (paymentMethod === "transferencia") {
      setStep("confirmar-transferencia");
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: "clamp(60px,10vw,120px) var(--pad)", textAlign: "center" }}>
        <p style={{ margin: "0 0 20px", font: "400 16px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>
          Tu carrito está vacío — no hay nada que llevar a checkout todavía.
        </p>
        <Btn onClick={() => router.push("/catalogo")}>Ver catálogo</Btn>
      </div>
    );
  }

  const backLink = (
    <Link
      href="/catalogo"
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
        padding: "10px 18px", borderRadius: "var(--btn-radius)",
        border: "1.5px solid var(--line-strong)",
        font: "700 13px/1 var(--ui-font)", color: "var(--ink)", textDecoration: "none",
      }}
    >
      <Icon name="back" size={16} /> Seguir comprando
    </Link>
  );

  if (step === "confirmar-transferencia") {
    return (
      <div style={{ padding: "clamp(24px,4vw,48px) var(--pad)" }}>
        <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0, maxWidth: 520 }}>
          <button
            onClick={() => setStep("checkout")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
              padding: "10px 18px", borderRadius: "var(--btn-radius)",
              border: "1.5px solid var(--line-strong)", background: "none", cursor: "pointer",
              font: "700 13px/1 var(--ui-font)", color: "var(--ink)",
            }}
          >
            <Icon name="back" size={16} /> Volver
          </button>

          <Eyebrow style={{ display: "block" }}>Transferencia bancaria</Eyebrow>
          <h1 style={{ margin: "10px 0 12px", font: "var(--h1-font)", color: "var(--ink)" }}>
            Confirmá tus datos
          </h1>
          <p style={{ margin: "0 0 28px", font: "400 15px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>
            Te vamos a mandar el alias para transferir y el WhatsApp para el comprobante a estos datos:
          </p>

          <div style={{
            display: "flex", flexDirection: "column", gap: 16,
            padding: 22, borderRadius: "var(--radius)", border: "1px solid var(--line)",
            background: "var(--surface)", boxShadow: "var(--shadow)",
          }}>
            <Field label="Email" type="email" value={form.email} onChange={(v) => updateField("email", v)} full />
            <Field label="WhatsApp" type="tel" value={form.phone} onChange={(v) => updateField("phone", v)} full />

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <Row label="Subtotal" value={fmt(subtotal)} />
              <Row label="Descuento transferencia (10%)" value={`-${fmt(discount)}`} />
              <Row label={shipping?.label ?? "Envío"} value={fmt(shipping?.cost ?? 0)} />
              <Row label="Total" value={fmt(total)} big />
            </div>

            <Btn size="lg" full onClick={handleConfirmTransferencia} disabled={submitting || !form.email.trim() || !form.phone.trim()}>
              {submitting ? "Enviando…" : <><Icon name="check" size={16} /> Confirmar pedido</>}
            </Btn>
            {submitNote && (
              <p style={{ margin: 0, font: "500 12px/1.4 var(--ui-font)", color: "var(--accent)", textAlign: "center" }}>
                {submitNote}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "clamp(24px,4vw,48px) var(--pad)" }}>
      <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
        {backLink}

        <Eyebrow style={{ display: "block" }}>Checkout</Eyebrow>
        <h1 style={{ margin: "10px 0 32px", font: "var(--h1-font)", color: "var(--ink)" }}>
          Finalizá tu compra
        </h1>

        <div className="split" style={{ "--cols": "1.3fr .9fr", alignItems: "start" } as React.CSSProperties}>
          {/* Formulario */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <section>
              <h2 style={SECTION_TITLE}><Icon name="mail" size={16} /> Contacto</h2>
              <div className="form-2">
                <Field label="Nombre y apellido" value={form.name} onChange={(v) => updateField("name", v)} full />
                <Field label="Email" type="email" value={form.email} onChange={(v) => updateField("email", v)} />
                <Field label="Teléfono" type="tel" value={form.phone} onChange={(v) => updateField("phone", v)} />
              </div>
            </section>

            <section>
              <h2 style={SECTION_TITLE}><Icon name="pin" size={16} /> Dirección de envío</h2>
              <div className="form-2">
                <Field label="Calle y número" value={form.street} onChange={(v) => updateField("street", v)} full />
                <Field label="Ciudad" value={form.city} onChange={(v) => updateField("city", v)} />
                <Field label="Provincia" value={form.province} onChange={(v) => updateField("province", v)} />
                <Field label="Código postal" value={form.postalCode} onChange={(v) => updateField("postalCode", v)} />
              </div>
            </section>

            <section>
              <h2 style={SECTION_TITLE}><Icon name="box" size={16} /> Envío</h2>
              <div className="form-2">
                {(Object.keys(SHIPPING_OPTIONS) as ShippingMethod[]).map((id) => {
                  const opt = SHIPPING_OPTIONS[id];
                  const selected = shippingMethod === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setShippingMethod(id)}
                      style={{
                        textAlign: "left", cursor: "pointer",
                        padding: 16, borderRadius: "var(--radius)",
                        border: `1.5px solid ${selected ? "var(--accent)" : "var(--line-strong)"}`,
                        background: selected ? "var(--bg-2)" : "var(--surface)",
                        display: "flex", flexDirection: "column", gap: 8,
                        transition: "all .15s ease",
                      }}
                    >
                      <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ font: "700 14px/1.2 var(--ui-font)", color: "var(--ink)" }}>{opt.label}</span>
                        <span style={{ font: "700 14px/1.2 var(--ui-font)", color: "var(--ink)", whiteSpace: "nowrap" }}>{fmt(opt.cost)}</span>
                      </span>
                      <span style={{ font: "400 12px/1.4 var(--ui-font)", color: "var(--ink-soft)" }}>{opt.description}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 style={SECTION_TITLE}><Icon name="sparkle" size={16} /> Método de pago</h2>
              <div className="form-2">
                {PAYMENT_METHODS.map((m) => {
                  const selected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      style={{
                        textAlign: "left", cursor: "pointer", position: "relative",
                        padding: 16, borderRadius: "var(--radius)",
                        border: `1.5px solid ${selected ? "var(--accent)" : "var(--line-strong)"}`,
                        background: selected ? "var(--bg-2)" : "var(--surface)",
                        display: "flex", flexDirection: "column", gap: 8,
                        transition: "all .15s ease",
                      }}
                    >
                      {m.badge && (
                        <span style={{
                          position: "absolute", top: -10, right: 12,
                          background: "var(--accent)", color: "var(--accent-ink)",
                          font: "700 10px/1 var(--ui-font)", padding: "4px 9px", borderRadius: 999,
                        }}>
                          {m.badge}
                        </span>
                      )}
                      <span style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: selected ? "var(--accent)" : "var(--bg-2)",
                        color: selected ? "var(--accent-ink)" : "var(--ink)",
                        display: "grid", placeItems: "center",
                      }}>
                        <Icon name={m.icon} size={16} />
                      </span>
                      <span style={{ font: "700 14px/1.2 var(--ui-font)", color: "var(--ink)" }}>{m.title}</span>
                      <span style={{ font: "400 12px/1.4 var(--ui-font)", color: "var(--ink-soft)" }}>{m.description}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Resumen */}
          <div className="sticky-desktop" style={{
            display: "flex", flexDirection: "column", gap: 16,
            padding: 22, borderRadius: "var(--radius)", border: "1px solid var(--line)",
            background: "var(--surface)", boxShadow: "var(--shadow)",
          }}>
            <h2 style={{ margin: 0, font: "700 16px/1 var(--ui-font)", color: "var(--ink)" }}>Tu pedido</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 260, overflowY: "auto" }}>
              {items.map((it, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ font: "600 13px/1.3 var(--ui-font)", color: "var(--ink)" }}>
                      {it.name} <span style={{ color: "var(--muted)", fontWeight: 400 }}>× {it.qty}</span>
                    </div>
                    <div style={{ font: "400 11px/1.4 'IBM Plex Mono', monospace", color: "var(--muted)" }}>
                      {COLORS[it.color]?.label} · talle {it.size}
                    </div>
                  </div>
                  <span style={{ font: "600 13px/1 var(--ui-font)", color: "var(--ink)", whiteSpace: "nowrap" }}>
                    {fmt(it.price * it.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <Row label="Subtotal" value={fmt(subtotal)} />
              {discount > 0 && (
                <Row label="Descuento transferencia (10%)" value={`-${fmt(discount)}`} />
              )}
              <Row
                label={shipping?.label ?? "Envío"}
                value={shipping ? fmt(shipping.cost) : "Elegí el envío"}
                muted={!shipping}
              />
              <Row label="Total" value={fmt(total)} big />
            </div>

            <Btn size="lg" full onClick={handleContinue} disabled={!canContinue || submitting}>
              {submitting
                ? "Redirigiendo a Mercado Pago…"
                : paymentMethod === "transferencia"
                  ? <>Continuar con transferencia <Icon name="arrow" size={16} /></>
                  : <><Icon name="check" size={16} /> Pagar con Mercado Pago</>}
            </Btn>
            {(!shipping || !paymentMethod) && (
              <p style={{ margin: 0, font: "400 12px/1.4 var(--ui-font)", color: "var(--muted)", textAlign: "center" }}>
                {!shipping ? "Elegí cómo querés recibir el pedido." : "Elegí un método de pago para continuar."}
              </p>
            )}
            {submitNote && (
              <p style={{ margin: 0, font: "500 12px/1.4 var(--ui-font)", color: "var(--accent)", textAlign: "center" }}>
                {submitNote}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  full?: boolean;
}

function Field({ label, value, onChange, type = "text", full }: FieldProps) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : undefined}>
      <label style={LABEL}>{label}</label>
      <input
        type={type}
        style={INPUT}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Row({ label, value, big, muted }: { label: React.ReactNode; value: string; big?: boolean; muted?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ font: `${big ? 700 : 400} ${big ? 15 : 14}px/1 var(--ui-font)`, color: "var(--ink)" }}>{label}</span>
      <span style={{
        font: `700 ${big ? 18 : 14}px/1 var(--ui-font)`,
        color: muted ? "var(--muted)" : "var(--ink)",
      }}>
        {value}
      </span>
    </div>
  );
}

const SECTION_TITLE: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  margin: "0 0 14px", font: "700 15px/1 var(--ui-font)", color: "var(--ink)",
};

const LABEL: React.CSSProperties = {
  display: "block", margin: "0 0 6px",
  font: "600 12px/1 var(--ui-font)", color: "var(--ink-soft)",
};

const INPUT: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: "var(--radius-sm)",
  border: "1.5px solid var(--line-strong)", background: "var(--surface)",
  font: "400 14px/1 var(--ui-font)", color: "var(--ink)", outline: "none",
};
