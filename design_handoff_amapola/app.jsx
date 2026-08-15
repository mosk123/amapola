// app.jsx — shell de Amapola: nav, carrito, ruteo, temas y tweaks
const { useState: useS, useEffect: useE } = React;

// ---------- Construcción de tema por dirección ----------
function buildTheme(dir, o) {
  const A = {
    bg: "#FBF6F1", bg2: "#F3E7DD", surface: "#FFFFFF", ink: "#3B302A", inkSoft: "#6E5F54",
    muted: "#9C8C7E", line: "#EBDFD4", lineStrong: "#D8C8BA", blush: "#E7D4C9",
    heroBg: "#F3E7DD", accentInk: "#FFFFFF",
    shadow: "0 10px 30px -16px rgba(80,55,40,.28)", shadowHover: "0 18px 40px -16px rgba(80,55,40,.4)",
    headTransform: "none", headTracking: "0", emStyle: "italic", btnTransform: "none", btnWeight: 700,
    headFamily: "'Cormorant Garamond', Georgia, serif",
    h1: "600 clamp(34px,4vw,46px)/1.16", h2: "600 clamp(26px,3vw,36px)/1.2",
    h3: "600 22px/1.2", cardTitle: "600 18px/1.25", stat: "600 25px/1",
    radius: 18, radiusSm: 12, btnRadius: 999,
  };
  const B = {
    bg: "#F4F2EA", bg2: "#E9E6D9", surface: "#FFFFFF", ink: "#373C30", inkSoft: "#5E6351",
    muted: "#8B8F77", line: "#E1DECF", lineStrong: "#CFCBB7", blush: "#E7D4C9",
    heroBg: "#EDEBE0", accentInk: "#FFFFFF",
    shadow: "0 1px 0 0 var(--line)", shadowHover: "0 10px 26px -16px rgba(55,60,48,.35)",
    headTransform: "uppercase", headTracking: ".05em", emStyle: "normal", btnTransform: "uppercase", btnWeight: 700,
    headFamily: "'Nunito Sans', sans-serif",
    h1: "800 clamp(28px,3.4vw,42px)/1.16", h2: "800 clamp(22px,2.6vw,30px)/1.18",
    h3: "700 17px/1.25", cardTitle: "700 15px/1.3", stat: "800 22px/1",
    radius: 6, radiusSm: 5, btnRadius: 4,
  };
  const t = dir === "B" ? B : A;
  const fam = o.headFamily || t.headFamily;
  const radius = o.radius != null ? o.radius : t.radius;
  return {
    "--bg": t.bg, "--bg-2": t.bg2, "--surface": t.surface, "--ink": t.ink, "--ink-soft": t.inkSoft,
    "--muted": t.muted, "--line": t.line, "--line-strong": t.lineStrong, "--blush": t.blush,
    "--hero-bg": t.heroBg, "--accent": o.accent || "#CE8C66", "--accent-ink": t.accentInk,
    "--shadow": t.shadow, "--shadow-hover": t.shadowHover,
    "--head-transform": t.headTransform, "--head-tracking": t.headTracking, "--em-style": t.emStyle,
    "--btn-transform": t.btnTransform, "--btn-weight": t.btnWeight,
    "--ui-font": "'Nunito Sans', sans-serif",
    "--h1-font": t.h1 + " " + fam,
    "--h2-font": t.h2 + " " + fam, "--h3-font": t.h3 + " " + fam,
    "--card-title-font": t.cardTitle + " " + fam, "--stat-font": t.stat + " " + fam,
    "--radius": radius + "px", "--radius-sm": t.radiusSm + "px", "--btn-radius": t.btnRadius + "px",
    "--cat-cols": String(o.cols || 4), "--pad": "clamp(20px,5vw,64px)",
  };
}

const DIR_ACCENT = { A: "#CE8C66", B: "#7E9266" };
const DIR_FONT = { A: "'Cormorant Garamond', Georgia, serif", B: "'Nunito Sans', sans-serif" };
const DIR_RADIUS = { A: 18, B: 6 };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direccion": "A",
  "acento": "#CE8C66",
  "titulos": "'Cormorant Garamond', Georgia, serif",
  "esquinas": 18,
  "columnas": "4"
}/*EDITMODE-END*/;

// ---------- Navbar ----------
function Nav({ route, go, cartCount, openCart }) {
  const links = [["home", "Inicio"], ["catalog", "Catálogo"], ["about", "Nosotras"], ["care", "Cuidados"], ["contact", "Contacto"]];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "color-mix(in srgb, var(--bg) 88%, transparent)",
      backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px var(--pad)" }}>
        <button onClick={() => go({ name: "home" })} style={{ display: "flex", alignItems: "center", gap: 11, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <img src={(window.__resources && window.__resources.logo) || "assets/amapola-logo.png"} alt="Amapola" style={{ width: 46, height: 46, borderRadius: "50%" }} />
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1, textAlign: "left" }}>
            <span style={{ font: "600 22px/1 var(--head-fam, 'Cormorant Garamond', serif)", letterSpacing: ".06em", color: "var(--ink)" }}>AMAPOLA</span>
            <span style={{ font: "500 9px/1.2 'IBM Plex Mono', monospace", letterSpacing: ".18em", color: "var(--muted)", marginTop: 3 }}>TEJIDOS ARTESANALES</span>
          </span>
        </button>
        <nav style={{ display: "flex", gap: 4, marginLeft: 18 }}>
          {links.map(([id, l]) => {
            const active = route.name === id || (id === "catalog" && route.name === "product");
            return (
              <button key={id} onClick={() => go({ name: id })} style={{
                font: "600 14px/1 var(--ui-font)", padding: "8px 14px", borderRadius: "var(--btn-radius)",
                border: "none", cursor: "pointer", background: "none",
                color: active ? "var(--ink)" : "var(--ink-soft)",
                position: "relative", textDecoration: active ? "underline" : "none",
                textUnderlineOffset: 6, textDecorationColor: "var(--accent)", textDecorationThickness: 2 }}>{l}</button>
            );
          })}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <button style={iconBtn} aria-label="Buscar"><Icon name="search" /></button>
          <button style={iconBtn} aria-label="Favoritos"><Icon name="heart" /></button>
          <button onClick={openCart} style={{ ...iconBtn, position: "relative" }} aria-label="Carrito">
            <Icon name="cart" />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: 2, right: 2, minWidth: 17, height: 17, padding: "0 4px",
                borderRadius: 999, background: "var(--accent)", color: "var(--accent-ink)",
                font: "700 10px/17px var(--ui-font)", textAlign: "center" }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
const iconBtn = { width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center",
  border: "none", background: "none", cursor: "pointer", color: "var(--ink)" };

// ---------- Carrito (drawer) ----------
function CartDrawer({ open, onClose, items, setItems, go }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const setQty = (idx, d) => setItems((arr) => arr.map((it, i) => i === idx ? { ...it, qty: Math.max(1, it.qty + d) } : it));
  const remove = (idx) => setItems((arr) => arr.filter((_, i) => i !== idx));
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(50,38,30,.32)",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .25s ease" }} />
      <aside style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 92vw)", zIndex: 70,
        background: "var(--bg)", boxShadow: "-20px 0 50px -20px rgba(50,38,30,.4)",
        transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .3s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px", borderBottom: "1px solid var(--line)" }}>
          <h2 style={{ margin: 0, font: "600 21px/1 var(--head-fam,'Cormorant Garamond',serif)", color: "var(--ink)" }}>Tu carrito</h2>
          <button onClick={onClose} style={iconBtn}><Icon name="close" /></button>
        </div>

        {items.length === 0 ? (
          <div style={{ flex: 1, display: "grid", placeContent: "center", textAlign: "center", gap: 14, padding: 30 }}>
            <span style={{ color: "var(--muted)", justifySelf: "center" }}><Icon name="cart" size={40} stroke={1.2} /></span>
            <p style={{ margin: 0, font: "400 15px/1.5 var(--ui-font)", color: "var(--ink-soft)" }}>Tu carrito está vacío.<br/>Date una vuelta por el telar.</p>
            <Btn onClick={() => { onClose(); go({ name: "catalog" }); }}>Ver catálogo</Btn>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 22px" }}>
              {items.map((it, idx) => (
                <div key={idx} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ width: 76, flexShrink: 0 }}><Photo label="" tone="caramel" ratio="4/5" round="var(--radius-sm)" /></div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <h3 style={{ margin: 0, font: "700 14px/1.2 var(--ui-font)", color: "var(--ink)" }}>{it.name}</h3>
                      <button onClick={() => remove(idx)} style={{ ...linkBtn, color: "var(--muted)" }} aria-label="Quitar"><Icon name="close" size={15} /></button>
                    </div>
                    <span style={{ font: "500 11px/1.3 'IBM Plex Mono', monospace", color: "var(--muted)" }}>{COLORS[it.color]?.label} · talle {it.size}</span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line-strong)", borderRadius: "var(--btn-radius)" }}>
                        <button onClick={() => setQty(idx, -1)} style={miniQty}><Icon name="minus" size={13} /></button>
                        <span style={{ width: 28, textAlign: "center", font: "700 13px/1 var(--ui-font)", color: "var(--ink)" }}>{it.qty}</span>
                        <button onClick={() => setQty(idx, 1)} style={miniQty}><Icon name="plus" size={13} /></button>
                      </div>
                      <span style={{ font: "700 14px/1 var(--ui-font)", color: "var(--ink)" }}>{fmt(it.price * it.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "18px 22px 24px", borderTop: "1px solid var(--line)", background: "var(--bg-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ font: "400 14px/1.4 var(--ui-font)", color: "var(--ink-soft)" }}>Subtotal</span>
                <span style={{ font: "700 18px/1 var(--ui-font)", color: "var(--ink)" }}>{fmt(subtotal)}</span>
              </div>
              <p style={{ margin: "0 0 14px", font: "500 11px/1.4 'IBM Plex Mono', monospace", color: "var(--muted)" }}>
                {subtotal >= 60000 ? "✓ Tu pedido tiene envío gratis" : `Te faltan ${fmt(60000 - subtotal)} para el envío gratis`}
              </p>
              <Btn full size="lg">Finalizar compra</Btn>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
const miniQty = { width: 28, height: 30, display: "grid", placeItems: "center", border: "none", background: "none", color: "var(--ink)", cursor: "pointer" };

// ---------- Footer ----------
function Footer({ go }) {
  return (
    <footer style={{ background: "var(--ink)", color: "var(--bg)", marginTop: 0 }}>
      <div className="wrap" style={{ padding: "56px var(--pad) 40px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 36 }}>
        <div>
          <div style={{ font: "600 24px/1 var(--head-fam,'Cormorant Garamond',serif)", letterSpacing: ".06em", marginBottom: 12 }}>AMAPOLA</div>
          <p style={{ margin: 0, font: "400 14px/1.6 var(--ui-font)", opacity: .8, maxWidth: 280 }}>Tejidos artesanales para abrigar a quienes querés. Hecho a mano, con tiempo y lanas nobles.</p>
        </div>
        {[["Tienda", [["Sweaters", { name: "catalog", cat: "sweaters" }], ["Accesorios", { name: "catalog", cat: "accesorios" }], ["Mantas", { name: "catalog", cat: "mantas" }], ["Catálogo", { name: "catalog" }]]], ["Amapola", [["Nosotras", { name: "about" }], ["Las tejedoras", { name: "about" }], ["Cuidados", { name: "care" }], ["Contacto", { name: "contact" }]]]].map(([h, items]) => (
          <div key={h}>
            <div style={{ font: "700 11px/1 var(--ui-font)", letterSpacing: ".14em", textTransform: "uppercase", opacity: .6, marginBottom: 16 }}>{h}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {items.map(([label, r]) => <button key={label} onClick={() => go(r)} style={{ background: "none", border: "none", color: "var(--bg)", opacity: .85, font: "400 14px/1 var(--ui-font)", cursor: "pointer", textAlign: "left", padding: 0 }}>{label}</button>)}
            </div>
          </div>
        ))}
        <div>
          <div style={{ font: "700 11px/1 var(--ui-font)", letterSpacing: ".14em", textTransform: "uppercase", opacity: .6, marginBottom: 16 }}>Sumate al club</div>
          <p style={{ margin: "0 0 12px", font: "400 13px/1.5 var(--ui-font)", opacity: .8 }}>Novedades, encargos y un mimo de bienvenida.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="tu@email.com" style={{ flex: 1, minWidth: 0, padding: "11px 14px", borderRadius: "var(--btn-radius)", border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.08)", color: "var(--bg)", font: "400 13px/1 var(--ui-font)" }} />
            <Btn size="sm">Unirme</Btn>
          </div>
        </div>
      </div>
      <div className="wrap" style={{ padding: "16px var(--pad)", borderTop: "1px solid rgba(255,255,255,.12)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, font: "400 12px/1.4 var(--ui-font)", opacity: .6 }}>
        <span>© 2026 Amapola Tejidos Artesanales</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Prototipo · hecho con cariño</span>
      </div>
    </footer>
  );
}

// ---------- App ----------
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useS({ name: "home" });
  const [cart, setCart] = useS([]);
  const [cartOpen, setCartOpen] = useS(false);

  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  const addToCart = (item) => { setCart((c) => [...c, item]); setCartOpen(true); };
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // Aplicar tema
  useE(() => {
    const vars = buildTheme(t.direccion, { accent: t.acento, headFamily: t.titulos, radius: t.esquinas, cols: t.columnas });
    for (const [k, v] of Object.entries(vars)) document.documentElement.style.setProperty(k, v);
    document.documentElement.style.setProperty("--head-fam", t.titulos);
    document.body.style.background = vars["--bg"];
  }, [t.direccion, t.acento, t.titulos, t.esquinas, t.columnas]);

  // Cambiar dirección re-sincroniza acento, tipografía y esquinas a los valores de esa dirección
  const changeDir = (dir) => setTweak({ direccion: dir, acento: DIR_ACCENT[dir], titulos: DIR_FONT[dir], esquinas: DIR_RADIUS[dir], columnas: t.columnas });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <Nav route={route} go={go} cartCount={cartCount} openCart={() => setCartOpen(true)} />
      <main style={{ flex: 1 }}>
        {route.name === "home" && <Home go={go} dir={t.direccion} />}
        {route.name === "catalog" && <Catalog key={route.cat || "all"} go={go} initialCat={route.cat} />}
        {route.name === "product" && <Product id={route.id} go={go} addToCart={addToCart} />}
        {route.name === "about" && <About go={go} />}
        {route.name === "care" && <Care go={go} />}
        {route.name === "contact" && <Contact go={go} />}
      </main>
      <Footer go={go} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} setItems={setCart} go={go} />

      <TweaksPanel>
        <TweakSection label="Dirección visual" />
        <TweakRadio label="Estilo" value={t.direccion} options={[{ value: "A", label: "A · Boutique" }, { value: "B", label: "B · Natural" }]} onChange={changeDir} />
        <TweakSection label="Color de acento" />
        <TweakColor label="Acento" value={t.acento} options={["#CE8C66", "#7E9266", "#C6A57C", "#CBA0A0", "#A98C73"]} onChange={(v) => setTweak("acento", v)} />
        <TweakSection label="Tipografía de títulos" />
        <TweakSelect label="Familia" value={t.titulos}
          options={[{ value: "'Cormorant Garamond', Georgia, serif", label: "Cormorant (serif)" }, { value: "'Playfair Display', Georgia, serif", label: "Playfair (serif)" }, { value: "'Nunito Sans', sans-serif", label: "Nunito (sans)" }]}
          onChange={(v) => setTweak("titulos", v)} />
        <TweakSection label="Detalle" />
        <TweakSlider label="Esquinas" value={t.esquinas} min={0} max={24} unit="px" onChange={(v) => setTweak("esquinas", v)} />
        <TweakRadio label="Columnas catálogo" value={t.columnas} options={["3", "4"]} onChange={(v) => setTweak("columnas", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
