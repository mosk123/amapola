import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";

const PASOS = [
  { icon: "droplet" as const, n: "01", title: "Lavado a mano", text: "Agua fría o tibia (max 30°C), jabón neutro o shampoo. Sin restregar." },
  { icon: "air" as const,     n: "02", title: "Sin centrifugar", text: "Exprimí suavemente sin torcer. Nunca en lavarropas con centrifugado." },
  { icon: "sun" as const,     n: "03", title: "Secado plano", text: "Estirá sobre una toalla seca, en la forma original. Lejos del sol directo." },
  { icon: "box" as const,     n: "04", title: "Guardado doblado", text: "Doblado, nunca colgado. El peso estira las fibras con el tiempo." },
  { icon: "sparkle" as const, n: "05", title: "Pilling normal", text: "El pilling es normal en lanas naturales. Sacalo con un quitabolitas suave." },
  { icon: "hand" as const,    n: "06", title: "Con cariño", text: "Cuanto más cuidás la prenda, más años te va a acompañar." },
];

const FIBRAS = [
  {
    icon: "leaf" as const,
    title: "Lana y alpaca",
    items: [
      "Lavado a mano en agua fría",
      "Jabón para lana o shampoo neutro",
      "No torcer al escurrir",
      "Secar plano sobre toalla",
      "No colgar (estira la prenda)",
      "Guardar con antipolilla natural",
    ],
  },
  {
    icon: "leaf" as const,
    title: "Algodón orgánico",
    items: [
      "Lavado a mano o ciclo delicado",
      "Agua fría o tibia (max 30°C)",
      "Se puede centrifugar suave",
      "Secar a la sombra",
      "Planchar a temperatura media si es necesario",
      "Más resistente que la lana al lavado",
    ],
  },
];

export default function CarePage() {
  return (
    <div>
      {/* Intro */}
      <section style={{ background: "var(--hero-bg)", borderBottom: "1px solid var(--line)", textAlign: "center" }}>
        <div className="wrap" style={{ padding: "clamp(48px,7vw,96px) var(--pad)" }}>
          <Eyebrow>Cuidados</Eyebrow>
          <h1 style={{
            margin: "16px 0 20px", font: "var(--h1-font)", color: "var(--ink)",
            textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
            letterSpacing: "var(--head-tracking)",
          }}>
            Para que te dure<br />
            <em style={{ fontStyle: "var(--em-style)", color: "var(--accent)" }}>muchos inviernos</em>
          </h1>
          <p style={{ margin: "0 auto", maxWidth: 520, font: "400 17px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>
            Las prendas artesanales duran décadas si se cuidan bien. Acá te contamos cómo hacerlo.
          </p>
        </div>
      </section>

      {/* 6 pasos */}
      <section className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Eyebrow>Guía de cuidado</Eyebrow>
          <h2 style={{
            margin: "12px 0 0", font: "var(--h2-font)", color: "var(--ink)",
            textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
            letterSpacing: "var(--head-tracking)",
          }}>
            Seis pasos básicos
          </h2>
        </div>
        <div className="grid-n" style={{ "--n": 3 } as React.CSSProperties}>
          {PASOS.map(({ icon, n, title, text }) => (
            <div key={n} style={{
              background: "var(--surface)", borderRadius: "var(--radius)",
              padding: "24px 22px", boxShadow: "var(--shadow)",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  width: 44, height: 44, borderRadius: "var(--radius-sm)",
                  background: "var(--bg-2)", display: "grid", placeItems: "center",
                  color: "var(--accent)",
                }}>
                  <Icon name={icon} size={20} />
                </span>
                <span style={{ font: "500 18px/1 'IBM Plex Mono', monospace", color: "var(--line-strong)" }}>{n}</span>
              </div>
              <h3 style={{ margin: 0, font: "var(--h3-font)", color: "var(--ink)" }}>{title}</h3>
              <p style={{ margin: 0, font: "400 14px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lana vs algodón */}
      <section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Eyebrow>Por fibra</Eyebrow>
            <h2 style={{
              margin: "12px 0 0", font: "var(--h2-font)", color: "var(--ink)",
              textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
              letterSpacing: "var(--head-tracking)",
            }}>
              Lana vs algodón
            </h2>
          </div>
          <div className="split" style={{ gap: 24 }}>
            {FIBRAS.map(({ icon, title, items }) => (
              <div key={title} style={{
                background: "var(--surface)", borderRadius: "var(--radius)",
                padding: "28px 24px", boxShadow: "var(--shadow)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{
                    width: 44, height: 44, borderRadius: "var(--radius-sm)",
                    background: "var(--bg-2)", display: "grid", placeItems: "center",
                    color: "var(--accent)",
                  }}>
                    <Icon name={icon} size={20} />
                  </span>
                  <h3 style={{ margin: 0, font: "var(--h3-font)", color: "var(--ink)" }}>{title}</h3>
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {items.map((item) => (
                    <li key={item} style={{ font: "400 14px/1.5 var(--ui-font)", color: "var(--ink-soft)" }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center" }}>
        <div className="wrap" style={{ padding: "clamp(48px,6vw,80px) var(--pad)" }}>
          <h2 style={{ margin: "0 0 16px", font: "var(--h2-font)", color: "var(--ink)" }}>
            ¿Tenés dudas sobre tu prenda?
          </h2>
          <p style={{ margin: "0 0 24px", font: "400 15px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>
            Escribinos, te ayudamos con gusto.
          </p>
          <Link
            href="/contacto"
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "14px 28px", borderRadius: "var(--btn-radius)",
              background: "var(--accent)", color: "var(--accent-ink)",
              font: "700 14px/1 var(--ui-font)", textDecoration: "none",
            }}
          >
            Contactanos <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
