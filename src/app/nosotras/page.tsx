import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";

const VALORES = [
  { icon: "clock" as const, title: "Tiempo justo", text: "No aceleramos el proceso. Cada pieza se termina cuando está lista, no antes." },
  { icon: "leaf" as const, title: "Fibras nobles", text: "Trabajamos con merino, alpaca, pima y lana de oveja. Sin sintéticos." },
  { icon: "hand" as const, title: "Manos que saben", text: "Nuestras tejedoras tienen décadas de oficio. Eso no se aprende en un video." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Intro */}
      <section style={{ background: "var(--hero-bg)", borderBottom: "1px solid var(--line)", textAlign: "center" }}>
        <div className="wrap" style={{ padding: "clamp(48px,7vw,96px) var(--pad)" }}>
          <Eyebrow>Sobre nosotras</Eyebrow>
          <h1 style={{
            margin: "16px 0 20px", font: "var(--h1-font)", color: "var(--ink)",
            textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
            letterSpacing: "var(--head-tracking)",
          }}>
            Tejido con tiempo,<br />
            <em style={{ fontStyle: "var(--em-style)", color: "var(--accent)" }}>hecho con cariño</em>
          </h1>
          <p style={{ margin: "0 auto", maxWidth: 560, font: "400 17px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>
            Somos un taller de tejido artesanal que nació de la pasión por las fibras naturales y el trabajo hecho a mano. Cada prenda que sale de nuestras agujas lleva horas de dedicación y mucho amor.
          </p>
        </div>
      </section>

      {/* Valores */}
      <section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Eyebrow>Lo que nos mueve</Eyebrow>
            <h2 style={{
              margin: "12px 0 0", font: "var(--h2-font)", color: "var(--ink)",
              textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
              letterSpacing: "var(--head-tracking)",
            }}>
              Nuestros valores
            </h2>
          </div>
          <div className="grid-n" style={{ "--n": 3, "--gap": "28px" } as React.CSSProperties}>
            {VALORES.map(({ icon, title, text }) => (
              <div key={title} style={{
                background: "var(--surface)", borderRadius: "var(--radius)",
                padding: "28px 24px", boxShadow: "var(--shadow)",
                display: "flex", flexDirection: "column", gap: 14,
              }}>
                <span style={{
                  width: 48, height: 48, borderRadius: "var(--radius-sm)",
                  background: "var(--bg-2)", display: "grid", placeItems: "center",
                  color: "var(--accent)",
                }}>
                  <Icon name={icon} size={22} />
                </span>
                <h3 style={{ margin: 0, font: "var(--h3-font)", color: "var(--ink)" }}>{title}</h3>
                <p style={{ margin: 0, font: "400 14px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--ink)", color: "var(--bg)", textAlign: "center" }}>
        <div className="wrap" style={{ padding: "clamp(48px,6vw,80px) var(--pad)" }}>
          <h2 style={{ margin: "0 0 20px", font: "var(--h2-font)", color: "var(--bg)" }}>
            ¿Te gusta lo que hacemos?
          </h2>
          <p style={{ margin: "0 0 28px", font: "400 16px/1.6 var(--ui-font)", opacity: .8 }}>
            Explorá nuestra colección y encontrá tu prenda favorita.
          </p>
          <Link
            href="/catalogo"
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "16px 32px", borderRadius: "var(--btn-radius)",
              background: "var(--accent)", color: "var(--accent-ink)",
              font: "700 14px/1 var(--ui-font)", textDecoration: "none",
            }}
          >
            Ver catálogo <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
