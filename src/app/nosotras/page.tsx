import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";
import Icon from "@/components/Icon";

const TEJEDORAS = [
  { name: "Laura M.", location: "Buenos Aires", bio: "Teje desde los 8 años. Sus ochos son legendarios en el taller.", tags: ["Dos agujas", "12 años"] },
  { name: "Claudia R.", location: "Rosario", bio: "Especialista en telar y tinturas naturales. Cada manta lleva su firma.", tags: ["Telar", "8 años"] },
  { name: "Sofía T.", location: "Córdoba", bio: "La más rápida del taller. Sus ganchillo son una obra maestra.", tags: ["Ganchillo", "5 años"] },
  { name: "Ana P.", location: "Mendoza", bio: "Diseñadora de puntos nuevos. Inventa un patrón por temporada.", tags: ["Diseño", "6 años"] },
];

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

      {/* Historia */}
      <section className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,4vw,64px)", alignItems: "center" }}>
          <Photo label="foto · el taller" tone="caramel" ratio="4 / 5" />
          <div>
            <Eyebrow>Nuestra historia</Eyebrow>
            <h2 style={{
              margin: "12px 0 20px", font: "var(--h2-font)", color: "var(--ink)",
              textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
              letterSpacing: "var(--head-tracking)",
            }}>
              De un regalo a un taller
            </h2>
            <p style={{ margin: "0 0 16px", font: "400 15px/1.7 var(--ui-font)", color: "var(--ink-soft)" }}>
              Todo empezó en 2019 con un sweater tejido como regalo de cumpleaños. La persona que lo recibió preguntó si hacíamos encargos. Hoy somos cuatro tejedoras y más de 1.200 prendas después, seguimos con las mismas agujas y las mismas ganas.
            </p>
            <p style={{ margin: "0 0 28px", font: "400 15px/1.7 var(--ui-font)", color: "var(--ink-soft)" }}>
              Trabajamos desde casa, cada una en su ciudad, con fibras que elegimos con cuidado. No tenemos máquinas. Tenemos manos, paciencia y muchas horas de dedicación.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              {[["2019", "Año de inicio"], ["4", "tejedoras"], ["+1.200", "prendas"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ font: "var(--stat-font)", color: "var(--ink)" }}>{n}</div>
                  <div style={{ font: "500 11px/1.3 'IBM Plex Mono', monospace", color: "var(--muted)", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
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

      {/* Las Tejedoras */}
      <section className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Eyebrow>Quiénes somos</Eyebrow>
          <h2 style={{
            margin: "12px 0 0", font: "var(--h2-font)", color: "var(--ink)",
            textTransform: "var(--head-transform)" as React.CSSProperties["textTransform"],
            letterSpacing: "var(--head-tracking)",
          }}>
            Las Tejedoras
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {TEJEDORAS.map((t) => (
            <div key={t.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
              <div style={{ width: "100%", maxWidth: 180 }}>
                <Photo label={t.name} tone="rosa" ratio="1 / 1" round="50%" />
              </div>
              <div>
                <h3 style={{ margin: "0 0 4px", font: "var(--h3-font)", color: "var(--ink)" }}>{t.name}</h3>
                <p style={{ margin: "0 0 8px", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, font: "500 11px/1 'IBM Plex Mono', monospace", color: "var(--muted)" }}>
                  <Icon name="pin" size={13} /> {t.location}
                </p>
                <p style={{ margin: "0 0 10px", font: "400 13px/1.5 var(--ui-font)", color: "var(--ink-soft)" }}>{t.bio}</p>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                  {t.tags.map((tag) => (
                    <span key={tag} style={{
                      padding: "4px 10px", borderRadius: 999,
                      background: "var(--bg-2)", font: "600 11px/1 var(--ui-font)",
                      color: "var(--ink-soft)",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
