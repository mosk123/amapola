// pages2.jsx — Nosotras, Las Tejedoras, Cuidados, Contacto
const { useState: useS2 } = React;

// ============================ NOSOTRAS ============================
const TEJEDORAS = [
  { name: "Rosa Quispe", place: "Maimará, Jujuy", years: 22, craft: "Telar y trenzas", tone: "caramel",
    bio: "Aprendió a tejer mirando a su abuela. Suyas son las mantas de telar y los puntos trenza más cerraditos." },
  { name: "Delia Mamani", place: "Tilcara, Jujuy", years: 15, craft: "Dos agujas", tone: "sage",
    bio: "La más rápida del taller sin perder prolijidad. Teje los sweaters de mujer y enseña a las que recién empiezan." },
  { name: "Marta Fernández", place: "Córdoba capital", years: 9, craft: "Crochet y accesorios", tone: "rosa",
    bio: "Llegó por un curso y se quedó. Los gorros con pompón y los guantes con hoja salen de sus manos." },
  { name: "Lucía Romero", place: "Tafí del Valle", years: 6, craft: "Algodón para peques", tone: "blush",
    bio: "Se especializa en prendas de bebé y niños: puntos suaves, sin costuras que molesten, pensados para la piel fina." },
];

function About({ go }) {
  return (
    <div>
      {/* INTRO */}
      <section style={{ background: "var(--hero-bg)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "clamp(40px,6vw,84px) var(--pad)", textAlign: "center", maxWidth: 760 }}>
          <Eyebrow>Nosotras</Eyebrow>
          <h1 style={{ margin: "14px auto 18px", font: "var(--h1-font)", color: "var(--ink)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)", maxWidth: 620 }}>
            Tejido con tiempo, <em style={{ fontStyle: "var(--em-style)", color: "var(--accent)" }}>hecho con cariño</em>
          </h1>
          <p style={{ margin: "0 auto", font: "400 17px/1.65 var(--ui-font)", color: "var(--ink-soft)", maxWidth: 580 }}>
            Amapola nació en 2019 entre ovillos, mates y la idea simple de que una prenda hecha a mano abriga distinto. Somos un taller de tejedoras que trabajamos a pedido, sin apuro y con fibras nobles.
          </p>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,4vw,60px)", alignItems: "center" }}>
          <Photo label="foto · el taller, ovillos y agujas" tone="caramel" ratio="4 / 5" />
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 480 }}>
            <Eyebrow>Cómo empezó</Eyebrow>
            <h2 style={{ margin: 0, font: "var(--h2-font)", color: "var(--ink)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)" }}>De un regalo a un taller</h2>
            <p style={{ margin: 0, font: "400 15px/1.7 var(--ui-font)", color: "var(--ink-soft)" }}>
              Todo arrancó con un sweater tejido para una amiga que estaba por ser mamá. Detrás vinieron los pedidos: una manta para la cuna, un cardigan igual pero para la mamá, gorros para los primos.
            </p>
            <p style={{ margin: 0, font: "400 15px/1.7 var(--ui-font)", color: "var(--ink-soft)" }}>
              Hoy somos un grupo de tejedoras de distintos puntos del país. Cada prenda lleva el nombre de quien la tejió en su etiqueta, porque detrás de cada punto hay un par de manos con historia.
            </p>
            <div style={{ display: "flex", gap: 28, marginTop: 6 }}>
              {[["2019", "primer ovillo"], ["4", "tejedoras"], ["+1.200", "prendas"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ font: "var(--stat-font)", color: "var(--ink)" }}>{n}</div>
                  <div style={{ font: "500 11px/1.3 'IBM Plex Mono', monospace", color: "var(--muted)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "clamp(48px,6vw,80px) var(--pad)" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Eyebrow>Lo que nos importa</Eyebrow>
            <h2 style={{ margin: "10px 0 0", font: "var(--h2-font)", color: "var(--ink)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)" }}>Tres cosas que no negociamos</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {[
              ["clock", "Tiempo justo", "Tejemos a pedido, sin stock que se amontone. Cada prenda toma las semanas que necesita y ni una menos."],
              ["leaf", "Fibras nobles", "Lana merino y de oveja, alpaca y algodón orgánico. Teñidos suaves, amables con la piel y con la tierra."],
              ["hand", "Manos que saben", "Nada de máquinas industriales. Punto por punto, con oficio que se pasó de abuelas a nietas."],
            ].map(([icon, title, body]) => (
              <div key={title} style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
                <span style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", background: "var(--surface)", color: "var(--accent)", display: "grid", placeItems: "center" }}><Icon name={icon} size={23} /></span>
                <h3 style={{ margin: 0, font: "var(--h3-font)", color: "var(--ink)" }}>{title}</h3>
                <p style={{ margin: 0, font: "400 14px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAS TEJEDORAS */}
      <section className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Eyebrow>Las tejedoras</Eyebrow>
          <h2 style={{ margin: "10px auto 14px", font: "var(--h2-font)", color: "var(--ink)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)" }}>Las manos detrás de cada punto</h2>
          <p style={{ margin: "0 auto", font: "400 15px/1.6 var(--ui-font)", color: "var(--ink-soft)", maxWidth: 520 }}>
            Somos cuatro, repartidas entre el norte y el centro del país. Esto es un poquito de cada una.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
          {TEJEDORAS.map((t) => (
            <article key={t.name} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Photo label={`foto · ${t.name}`} tone={t.tone} ratio="1 / 1" round="50%" />
              <div>
                <h3 style={{ margin: "0 0 2px", font: "var(--h3-font)", color: "var(--ink)" }}>{t.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", marginBottom: 8 }}>
                  <Icon name="pin" size={13} />
                  <span style={{ font: "500 11px/1.2 'IBM Plex Mono', monospace" }}>{t.place}</span>
                </div>
                <p style={{ margin: "0 0 10px", font: "400 13px/1.55 var(--ui-font)", color: "var(--ink-soft)" }}>{t.bio}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={tagStyle}>{t.craft}</span>
                  <span style={tagStyle}>{t.years} años tejiendo</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CTA go={go} title="¿Te gustaría una prenda tejida para vos?" body="Mirá la colección o escribinos para un encargo a medida." />
    </div>
  );
}
const tagStyle = { font: "600 10px/1 var(--ui-font)", letterSpacing: ".04em", color: "var(--ink-soft)", background: "var(--bg-2)", padding: "5px 9px", borderRadius: 999 };

// ============================ CUIDADOS ============================
function Care({ go }) {
  const steps = [
    ["droplet", "Lavá a mano, con calma", "Agua fría o tibia y un jabón neutro o shampoo suave. Sumergí la prenda, apretala despacio y nunca la retuerzas. La lana no necesita fricción, necesita paciencia."],
    ["air", "Sacá el agua sin estrujar", "Apretá entre las manos para quitar el exceso y después envolvé la prenda en una toalla seca y presioná. Así sale el agua sin estirar el tejido."],
    ["sun", "Secá siempre en plano", "Estirá la prenda sobre una toalla, lejos del sol directo y de la estufa. Colgada se deforma y se estira el cuello. En plano vuelve a su forma sola."],
    ["box", "Guardá doblada, no colgada", "En el placard, dobladas y con espacio para respirar. Si la guardás por temporada, sumá un saquito de lavanda: cuida el tejido y ahuyenta las polillas."],
    ["sparkle", "Las pelusitas son normales", "En las primeras puestas la lana suelta pelusa: es parte del proceso, no un defecto. Pasá una maquinita quita-pelusas o un peine de madera y queda como nueva."],
    ["hand", "Manchas, al toque", "Tratá la mancha apenas pasa, con un trapo húmedo y de afuera hacia adentro. Evitá frotar fuerte. Ante la duda, mejor lavado profesional en seco."],
  ];
  return (
    <div>
      <section style={{ background: "var(--hero-bg)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "clamp(40px,6vw,84px) var(--pad)", textAlign: "center", maxWidth: 720 }}>
          <Eyebrow>Cuidados</Eyebrow>
          <h1 style={{ margin: "14px auto 18px", font: "var(--h1-font)", color: "var(--ink)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)", maxWidth: 600 }}>
            Para que te dure <em style={{ fontStyle: "var(--em-style)", color: "var(--accent)" }}>muchos inviernos</em>
          </h1>
          <p style={{ margin: "0 auto", font: "400 17px/1.65 var(--ui-font)", color: "var(--ink-soft)", maxWidth: 560 }}>
            Una prenda tejida a mano bien cuidada acompaña años. Estos seis gestos simples son todo lo que necesita tu lana o tu algodón para seguir como el primer día.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ padding: "clamp(48px,6vw,80px) var(--pad)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
          {steps.map(([icon, title, body], i) => (
            <div key={title} style={{ display: "flex", flexDirection: "column", gap: 13, padding: 26, background: "var(--surface)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <span style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--bg-2)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={icon} size={22} /></span>
                <span style={{ font: "700 13px/1 'IBM Plex Mono', monospace", color: "var(--muted)" }}>0{i + 1}</span>
              </div>
              <h3 style={{ margin: 0, font: "var(--h3-font)", color: "var(--ink)" }}>{title}</h3>
              <p style={{ margin: 0, font: "400 14px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Nota lana vs algodón */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 28 }}>
          {[
            ["Lana, alpaca y merino", "No necesitan lavarse seguido: muchas veces alcanza con airearlas. Cuando toque, agua fría y jabón neutro. Nunca al lavarropas salvo que tenga programa de lana en frío."],
            ["Algodón y prendas de bebé", "Aguantan lavados más frecuentes, siempre en frío y del revés. Para los peques, jabón hipoalergénico y nada de suavizantes con perfume fuerte."],
          ].map(([h, b]) => (
            <div key={h} style={{ padding: 24, borderRadius: "var(--radius)", background: "var(--bg-2)", border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10, color: "var(--accent)" }}>
                <Icon name="leaf" size={18} />
                <h3 style={{ margin: 0, font: "var(--h3-font)", color: "var(--ink)" }}>{h}</h3>
              </div>
              <p style={{ margin: 0, font: "400 14px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>{b}</p>
            </div>
          ))}
        </div>
      </section>

      <CTA go={go} title="¿Quedó alguna duda sobre el cuidado?" body="Escribinos y te ayudamos con tu prenda puntual." cta="Contacto" route={{ name: "contact" }} />
    </div>
  );
}

// ============================ CONTACTO ============================
function Contact({ go }) {
  const [sent, setSent] = useS2(false);
  const inputStyle = { width: "100%", padding: "13px 15px", borderRadius: "var(--btn-radius)", border: "1.5px solid var(--line-strong, var(--line))", background: "var(--surface)", color: "var(--ink)", font: "400 14px/1.4 var(--ui-font)" };
  const labelStyle = { font: "600 12px/1 var(--ui-font)", color: "var(--ink-soft)", marginBottom: 8, display: "block", letterSpacing: ".02em" };
  const channels = [
    ["chat", "WhatsApp", "+54 9 388 400 0000", "Lun a vie, 9 a 18 h"],
    ["mail", "Email", "hola@amapola.com.ar", "Te respondemos en el día"],
    ["instagram", "Instagram", "@amapola.tejidos", "Novedades y detrás de escena"],
    ["pin", "El taller", "Tilcara, Jujuy", "Visitas con cita previa"],
  ];
  return (
    <div>
      <section style={{ background: "var(--hero-bg)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "clamp(40px,5vw,72px) var(--pad)", textAlign: "center", maxWidth: 680 }}>
          <Eyebrow>Contacto</Eyebrow>
          <h1 style={{ margin: "14px auto 16px", font: "var(--h1-font)", color: "var(--ink)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)" }}>
            Escribinos, <em style={{ fontStyle: "var(--em-style)", color: "var(--accent)" }}>te leemos</em>
          </h1>
          <p style={{ margin: "0 auto", font: "400 16px/1.6 var(--ui-font)", color: "var(--ink-soft)", maxWidth: 520 }}>
            ¿Querés un encargo a medida, tenés una duda con un talle o sobre un color? Contanos y te respondemos a la brevedad.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ padding: "clamp(40px,5vw,72px) var(--pad)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: "clamp(32px,5vw,64px)", alignItems: "start" }}>
          {/* Formulario */}
          <div style={{ padding: "clamp(24px,3vw,36px)", background: "var(--surface)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 10px", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
                <span style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--bg-2)", color: "var(--accent)", display: "grid", placeItems: "center" }}><Icon name="check" size={28} /></span>
                <h3 style={{ margin: 0, font: "var(--h3-font)", color: "var(--ink)" }}>¡Gracias! Recibimos tu mensaje</h3>
                <p style={{ margin: 0, font: "400 14px/1.6 var(--ui-font)", color: "var(--ink-soft)", maxWidth: 320 }}>Te respondemos dentro de las próximas 24 horas hábiles. Mientras tanto, date una vuelta por el catálogo.</p>
                <Btn variant="outline" onClick={() => setSent(false)}>Enviar otro mensaje</Btn>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div><label style={labelStyle}>Nombre</label><input required style={inputStyle} placeholder="Tu nombre" /></div>
                  <div><label style={labelStyle}>Email</label><input required type="email" style={inputStyle} placeholder="tu@email.com" /></div>
                </div>
                <div>
                  <label style={labelStyle}>¿Sobre qué nos escribís?</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }}>
                    <option>Un encargo a medida</option>
                    <option>Consulta de talle o color</option>
                    <option>Estado de mi pedido</option>
                    <option>Ventas por mayor</option>
                    <option>Otra cosa</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Mensaje</label>
                  <textarea required rows={5} style={{ ...inputStyle, resize: "vertical", minHeight: 120 }} placeholder="Contanos qué tenés en mente…" />
                </div>
                <Btn type="submit" size="lg" full icon="arrow">Enviar mensaje</Btn>
                <p style={{ margin: 0, font: "400 12px/1.5 var(--ui-font)", color: "var(--muted)", textAlign: "center" }}>También podés escribirnos directo por WhatsApp y te respondemos más rápido.</p>
              </form>
            )}
          </div>

          {/* Canales */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {channels.map(([icon, title, value, note]) => (
              <div key={title} style={{ display: "flex", gap: 15, padding: 18, borderRadius: "var(--radius)", background: "var(--bg-2)", border: "1px solid var(--line)" }}>
                <span style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--surface)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={icon} size={21} /></span>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={{ font: "700 11px/1 var(--ui-font)", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)" }}>{title}</span>
                  <span style={{ font: "700 15px/1.2 var(--ui-font)", color: "var(--ink)" }}>{value}</span>
                  <span style={{ font: "400 12px/1.3 var(--ui-font)", color: "var(--ink-soft)" }}>{note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================ CTA reutilizable ============================
function CTA({ go, title, body, cta = "Ver catálogo", route = { name: "catalog" } }) {
  return (
    <section style={{ background: "var(--ink)", color: "var(--bg)" }}>
      <div className="wrap" style={{ padding: "clamp(44px,5vw,72px) var(--pad)", textAlign: "center", maxWidth: 640 }}>
        <h2 style={{ margin: "0 0 12px", font: "var(--h2-font)", color: "var(--bg)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)" }}>{title}</h2>
        <p style={{ margin: "0 auto 24px", font: "400 16px/1.6 var(--ui-font)", opacity: .85, maxWidth: 480 }}>{body}</p>
        <Btn size="lg" onClick={() => go(route)} icon="arrow">{cta}</Btn>
      </div>
    </section>
  );
}

Object.assign(window, { About, Care, Contact });
