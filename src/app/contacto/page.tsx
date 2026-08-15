"use client";

import { useState } from "react";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";

const CANALES = [
  { icon: "chat" as const, label: "WhatsApp", value: "+54 9 11 0000-0000", note: "Lun–Vie 10–18 h" },
  { icon: "mail" as const, label: "Email", value: "hola@amapola.com.ar", note: "Respondemos en 24 h" },
  { icon: "instagram" as const, label: "Instagram", value: "@amapola.tejidos", note: "DM siempre abierto" },
  { icon: "pin" as const, label: "El taller", value: "Buenos Aires, Argentina", note: "Solo con turno previo" },
];

const ASUNTOS = [
  "Consulta de producto",
  "Encargo personalizado",
  "Cuidados y reparaciones",
  "Mayorista",
  "Otro",
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", asunto: ASUNTOS[0], mensaje: "" });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      {/* Grid formulario + canales */}
      <section style={{ background: "var(--bg-2)" }}>
        <div className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: "clamp(28px,4vw,60px)" }}>

            {/* Formulario */}
            <div style={{
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--line)",
              overflow: "hidden",
              boxShadow: "var(--shadow)",
            }}>
              {/* Franja superior de acento */}
              <div style={{
                height: 4,
                background: "linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 40%, var(--blush)))",
              }} />

              <div style={{ padding: "32px 32px 36px" }}>
                {sent ? (
                  <div style={{ textAlign: "center", padding: "48px 20px", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
                    <span style={{
                      width: 64, height: 64, borderRadius: "50%",
                      background: "var(--bg-2)", border: "1px solid var(--line)",
                      display: "grid", placeItems: "center", color: "var(--accent)",
                    }}>
                      <Icon name="check" size={28} />
                    </span>
                    <div>
                      <Eyebrow style={{ display: "block", marginBottom: 10 }}>Todo listo</Eyebrow>
                      <h2 style={{ margin: 0, font: "var(--h2-font)", color: "var(--ink)" }}>¡Mensaje enviado!</h2>
                    </div>
                    <p style={{ margin: 0, font: "400 15px/1.6 var(--ui-font)", color: "var(--ink-soft)", maxWidth: 320 }}>
                      Te respondemos en menos de 24 horas. ¡Gracias por escribirnos!
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ nombre: "", email: "", asunto: ASUNTOS[0], mensaje: "" }); }}
                      style={{
                        marginTop: 8, padding: "11px 24px", borderRadius: "var(--btn-radius)",
                        border: "1.5px solid var(--line-strong)", background: "transparent",
                        font: "600 14px/1 var(--ui-font)", color: "var(--ink)", cursor: "pointer",
                      }}
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 28 }}>
                      <Eyebrow style={{ display: "block", marginBottom: 10 }}>Formulario de contacto</Eyebrow>
                      <h2 style={{ margin: 0, font: "var(--h2-font)", color: "var(--ink)" }}>
                        Mandanos un mensaje
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <FormField label="Nombre *">
                          <input
                            required value={form.nombre}
                            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                            style={INPUT}
                            placeholder="Tu nombre"
                          />
                        </FormField>
                        <FormField label="Email *">
                          <input
                            required type="email" value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            style={INPUT}
                            placeholder="tu@email.com"
                          />
                        </FormField>
                      </div>

                      <FormField label="Asunto">
                        <select
                          value={form.asunto}
                          onChange={(e) => setForm((f) => ({ ...f, asunto: e.target.value }))}
                          style={{ ...INPUT, cursor: "pointer" }}
                        >
                          {ASUNTOS.map((a) => <option key={a}>{a}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Mensaje *">
                        <textarea
                          required value={form.mensaje}
                          onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
                          rows={5}
                          placeholder="Contanos en qué te podemos ayudar..."
                          style={{ ...INPUT, resize: "vertical", lineHeight: 1.6 }}
                        />
                      </FormField>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingTop: 4 }}>
                        <button
                          type="submit"
                          style={{
                            padding: "14px 32px", borderRadius: "var(--btn-radius)",
                            background: "var(--accent)", color: "var(--accent-ink)",
                            font: "700 14px/1 var(--ui-font)", border: "none", cursor: "pointer",
                            letterSpacing: ".02em",
                          }}
                        >
                          Enviar mensaje
                        </button>
                        <span style={{ font: "400 12px/1.4 var(--ui-font)", color: "var(--muted)" }}>
                          * Campos obligatorios
                        </span>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Canales */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ margin: "0 0 8px", font: "700 11px/1 var(--ui-font)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)" }}>
                También podés escribirnos por
              </p>
              {CANALES.map(({ icon, label, value, note }) => (
                <div key={label} style={{
                  background: "var(--surface)", borderRadius: "var(--radius)",
                  border: "1px solid var(--line)",
                  padding: "18px 20px", display: "flex", gap: 14, alignItems: "center",
                  boxShadow: "var(--shadow)",
                }}>
                  <span style={{
                    width: 42, height: 42, borderRadius: "var(--radius-sm)",
                    background: "var(--bg-2)", display: "grid", placeItems: "center",
                    color: "var(--accent)", flexShrink: 0,
                  }}>
                    <Icon name={icon} size={19} />
                  </span>
                  <div>
                    <p style={{ margin: "0 0 2px", font: "700 10px/1 'IBM Plex Mono', monospace", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)" }}>
                      {label}
                    </p>
                    <p style={{ margin: "0 0 3px", font: "600 14px/1.3 var(--ui-font)", color: "var(--ink)" }}>{value}</p>
                    <p style={{ margin: 0, font: "400 12px/1.3 var(--ui-font)", color: "var(--muted)" }}>{note}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: "block", marginBottom: 7,
        font: "600 12px/1 var(--ui-font)", letterSpacing: ".06em",
        textTransform: "uppercase", color: "var(--ink-soft)",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const INPUT: React.CSSProperties = {
  width: "100%", padding: "12px 16px",
  borderRadius: "var(--radius-sm)", border: "1.5px solid var(--line-strong)",
  background: "var(--bg)", font: "400 14px/1 var(--ui-font)", color: "var(--ink)",
  outline: "none", boxSizing: "border-box",
};
