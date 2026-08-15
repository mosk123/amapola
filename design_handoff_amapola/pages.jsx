// pages.jsx — Home, Catálogo y Detalle de producto
const { useState: useStateP, useMemo } = React;

const toneFor = (p) => {
  const c = p.colors[0];
  if (["salvia", "musgo"].includes(c)) return "sage";
  if (["rosa"].includes(c)) return "rosa";
  if (["arena", "trigo", "crudo"].includes(c)) return "caramel";
  return "blush";
};

// ============================ HOME ============================
function Home({ go, dir }) {
  const featured = PRODUCTS.filter((p) => p.badge).slice(0, 4);
  return (
    <div>
      {/* HERO */}
      <section style={{ background: "var(--hero-bg)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr",
          gap: 56, alignItems: "center", padding: "clamp(40px, 7vw, 96px) var(--pad)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 520 }}>
            <Eyebrow>Tejidos artesanales · desde 2019</Eyebrow>
            <h1 style={{ margin: "0 0 8px", font: "var(--h1-font)", color: "var(--ink)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)" }}>
              Abrigo tejido a mano,<br /><em style={{ fontStyle: "var(--em-style)", color: "var(--accent)" }}>una pieza a la vez</em>
            </h1>
            <p style={{ margin: 0, font: "400 17px/1.6 var(--ui-font)", color: "var(--ink-soft)", maxWidth: 440 }}>
              Sweaters, accesorios y mantas tejidos en lanas y algodones naturales. Para mujeres, niños y rincones de casa que piden calorcito.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn size="lg" onClick={() => go({ name: "catalog" })} icon="arrow">Ver catálogo</Btn>
              <Btn size="lg" variant="outline" onClick={() => go({ name: "catalog", cat: "sweaters" })}>Sweaters</Btn>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 6 }}>
              {[["100%", "fibras naturales"], ["+1.200", "prendas tejidas"], ["2-3", "sem · por encargo"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ font: "var(--stat-font)", color: "var(--ink)" }}>{n}</div>
                  <div style={{ font: "500 11px/1.3 'IBM Plex Mono', monospace", color: "var(--muted)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <Photo label="foto principal · modelo con sweater tejido" tone="blush" ratio="4 / 5" />
            <div style={{ position: "absolute", bottom: -22, left: -22, width: 132, height: 132,
              borderRadius: "50%", background: "var(--surface)", boxShadow: "var(--shadow)",
              display: "grid", placeItems: "center", padding: 12 }}>
              <img src={(window.__resources && window.__resources.logo) || "assets/amapola-logo.png"} alt="Amapola" style={{ width: "100%", borderRadius: "50%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <Eyebrow>Qué tejemos</Eyebrow>
            <h2 style={{ margin: "10px 0 0", font: "var(--h2-font)", color: "var(--ink)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)" }}>Tres familias, un mismo telar</h2>
          </div>
          <button onClick={() => go({ name: "catalog" })} style={linkBtn}>Ver todo <Icon name="arrow" size={15} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {CATEGORIES.map((c, i) => (
            <button key={c.id} onClick={() => go({ name: "catalog", cat: c.id })}
              style={{ textAlign: "left", border: "none", background: "none", cursor: "pointer", padding: 0,
                display: "flex", flexDirection: "column", gap: 14 }}>
              <Photo label={`foto · ${c.label.toLowerCase()}`} tone={["caramel","sage","rosa"][i]} ratio="3 / 4" />
              <div>
                <h3 style={{ margin: "0 0 4px", font: "var(--h3-font)", color: "var(--ink)" }}>{c.label}</h3>
                <p style={{ margin: 0, font: "400 13px/1.45 var(--ui-font)", color: "var(--ink-soft)" }}>{c.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <Eyebrow>Recién salidos de las agujas</Eyebrow>
            <h2 style={{ margin: "10px 0 0", font: "var(--h2-font)", color: "var(--ink)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)" }}>Favoritos de la temporada</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
            {featured.map((p) => <ProductCard key={p.id} p={p} tone={toneFor(p)} onOpen={(p) => go({ name: "product", id: p.id })} />)}
          </div>
        </div>
      </section>

      {/* HECHO A MANO */}
      <section className="wrap" style={{ padding: "clamp(48px,6vw,84px) var(--pad)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {[
            ["hand", "Tejido a mano", "Cada prenda se teje en dos agujas o telar, punto por punto. Nada de máquinas industriales."],
            ["leaf", "Fibras naturales", "Lana merino, alpaca y algodón orgánico. Teñidos suaves, nobles con la piel y con el ambiente."],
            ["truck", "Por encargo", "Tejemos a pedido para no desperdiciar. Tu prenda sale en 2 a 3 semanas y llega a todo el país."],
          ].map(([icon, title, body]) => (
            <div key={title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ width: 46, height: 46, borderRadius: "var(--radius-sm)", background: "var(--bg-2)",
                color: "var(--accent)", display: "grid", placeItems: "center" }}><Icon name={icon} size={22} /></span>
              <h3 style={{ margin: 0, font: "var(--h3-font)", color: "var(--ink)" }}>{title}</h3>
              <p style={{ margin: 0, font: "400 14px/1.55 var(--ui-font)", color: "var(--ink-soft)" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ============================ CATÁLOGO ============================
function Catalog({ go, initialCat }) {
  const [cat, setCat] = useStateP(initialCat || "todos");
  const [aud, setAud] = useStateP("todos");
  const [sort, setSort] = useStateP("destacados");

  const items = useMemo(() => {
    let r = PRODUCTS.filter((p) => (cat === "todos" || p.cat === cat) && (aud === "todos" || p.audience === aud));
    if (sort === "menor") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "mayor") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [cat, aud, sort]);

  const cats = [["todos", "Todo"], ...CATEGORIES.map((c) => [c.id, c.label])];
  const auds = [["todos", "Todos"], ["Mujer", "Mujer"], ["Niños", "Niños"], ["Hogar", "Hogar"]];

  return (
    <div className="wrap" style={{ padding: "clamp(28px,4vw,52px) var(--pad) 80px" }}>
      <div style={{ marginBottom: 8 }}>
        <Eyebrow>Catálogo</Eyebrow>
        <h1 style={{ margin: "8px 0 0", font: "var(--h2-font)", color: "var(--ink)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)" }}>Nuestra colección</h1>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
        flexWrap: "wrap", padding: "20px 0 22px", borderBottom: "1px solid var(--line)", marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cats.map(([id, l]) => <Chip key={id} active={cat === id} onClick={() => setCat(id)}>{l}</Chip>)}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {auds.map(([id, l]) => <Chip key={id} small active={aud === id} onClick={() => setAud(id)}>{l}</Chip>)}
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
            font: "500 13px/1 var(--ui-font)", color: "var(--ink)", padding: "9px 12px",
            border: "1px solid var(--line-strong, var(--line))", borderRadius: "var(--btn-radius)",
            background: "var(--surface)", cursor: "pointer" }}>
            <option value="destacados">Destacados</option>
            <option value="menor">Precio: menor a mayor</option>
            <option value="mayor">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      <div style={{ font: "500 12px/1 'IBM Plex Mono', monospace", color: "var(--muted)", marginBottom: 22 }}>
        {items.length} {items.length === 1 ? "prenda" : "prendas"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(var(--cat-cols, 4), 1fr)", gap: 24 }}>
        {items.map((p) => <ProductCard key={p.id} p={p} tone={toneFor(p)} onOpen={(p) => go({ name: "product", id: p.id })} />)}
      </div>
    </div>
  );
}

function Chip({ children, active, onClick, small }) {
  return (
    <button onClick={onClick} style={{
      font: `600 ${small ? 12 : 13}px/1 var(--ui-font)`, padding: small ? "8px 13px" : "9px 16px",
      borderRadius: "var(--btn-radius)", cursor: "pointer", transition: "all .15s ease",
      border: "1px solid " + (active ? "var(--accent)" : "var(--line-strong, var(--line))"),
      background: active ? "var(--accent)" : "var(--surface)",
      color: active ? "var(--accent-ink, #fff)" : "var(--ink-soft)",
    }}>{children}</button>
  );
}

// ============================ PRODUCTO ============================
function Product({ id, go, addToCart }) {
  const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
  const [color, setColor] = useStateP(p.colors[0]);
  const [size, setSize] = useStateP(p.sizes[0]);
  const [qty, setQty] = useStateP(1);
  const [activeImg, setActiveImg] = useStateP(0);
  const [added, setAdded] = useStateP(false);
  const tone = toneFor(p);
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3);

  const doAdd = () => {
    addToCart({ ...p, color, size, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="wrap" style={{ padding: "clamp(20px,3vw,36px) var(--pad) 80px" }}>
      <button onClick={() => go({ name: "catalog" })} style={{ ...linkBtn, marginBottom: 24 }}>
        <Icon name="back" size={15} /> Volver al catálogo
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,4vw,60px)", alignItems: "start" }}>
        {/* Galería */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 92 }}>
          <Photo label={`foto ${activeImg + 1} · ${p.name}`} tone={tone} ratio="4 / 5" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[0, 1, 2, 3].map((i) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{ padding: 0, border: "2px solid " + (activeImg === i ? "var(--accent)" : "transparent"), borderRadius: "var(--radius-sm)", cursor: "pointer", overflow: "hidden", background: "none" }}>
                <Photo label={`#${i + 1}`} tone={["caramel","sage","rosa","blush"][i]} round={0} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <Eyebrow>{CATEGORIES.find((c) => c.id === p.cat)?.label}</Eyebrow>
              {p.badge && <span style={{ font: "700 10px/1 var(--ui-font)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink)", background: "var(--bg-2)", padding: "5px 10px", borderRadius: 999 }}>{p.badge}</span>}
            </div>
            <h1 style={{ margin: 0, font: "var(--h1-font)", color: "var(--ink)" }}>{p.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
              <span style={{ font: "700 26px/1 var(--ui-font)", color: "var(--ink)" }}>{fmt(p.price)}</span>
              <span style={{ display: "flex", gap: 4, color: "var(--accent)" }}>
                {[0,1,2,3,4].map((i) => <Icon key={i} name="star" size={14} stroke={0} />)}
              </span>
              <span style={{ font: "500 12px/1 'IBM Plex Mono', monospace", color: "var(--muted)" }}>(28 reseñas)</span>
            </div>
          </div>

          <p style={{ margin: 0, font: "400 16px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>{p.desc}</p>

          {/* Color */}
          <div>
            <div style={selLabel}>Color · <strong style={{ color: "var(--ink)" }}>{COLORS[color]?.label}</strong></div>
            <div style={{ display: "flex", gap: 10 }}>
              {p.colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} title={COLORS[c]?.label} style={{
                  width: 38, height: 38, borderRadius: "50%", cursor: "pointer", background: COLORS[c]?.hex,
                  border: "2px solid " + (color === c ? "var(--ink)" : "transparent"),
                  outline: "1px solid rgba(0,0,0,.08)", outlineOffset: -1 }} />
              ))}
            </div>
          </div>

          {/* Talle */}
          <div>
            <div style={selLabel}>Talle</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {p.sizes.map((s) => <Chip key={s} active={size === s} onClick={() => setSize(s)}>{s}</Chip>)}
            </div>
          </div>

          {/* Cantidad + agregar */}
          <div style={{ display: "flex", gap: 12, alignItems: "stretch", marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--line-strong, var(--line))", borderRadius: "var(--btn-radius)", overflow: "hidden" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}><Icon name="minus" size={15} /></button>
              <span style={{ width: 38, textAlign: "center", font: "700 15px/1 var(--ui-font)", color: "var(--ink)" }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} style={qtyBtn}><Icon name="plus" size={15} /></button>
            </div>
            <Btn full size="lg" onClick={doAdd} icon={added ? "check" : "cart"}>{added ? "Agregado" : "Agregar al carrito"}</Btn>
          </div>

          {/* Detalles */}
          <div style={{ borderTop: "1px solid var(--line)", marginTop: 6, paddingTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            {[["leaf", p.fiber], ["hand", "Tejido a mano · listo en 2-3 semanas"], ["truck", "Envío a todo el país · gratis desde $60.000"]].map(([ic, tx]) => (
              <div key={tx} style={{ display: "flex", gap: 11, alignItems: "center", color: "var(--ink-soft)" }}>
                <span style={{ color: "var(--accent)" }}><Icon name={ic} size={18} /></span>
                <span style={{ font: "500 14px/1.4 var(--ui-font)" }}>{tx}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Relacionados */}
      <div style={{ marginTop: "clamp(56px,7vw,96px)" }}>
        <h2 style={{ margin: "0 0 26px", font: "var(--h2-font)", color: "var(--ink)", textTransform: "var(--head-transform)", letterSpacing: "var(--head-tracking)" }}>También tejimos</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {related.map((r) => <ProductCard key={r.id} p={r} tone={toneFor(r)} onOpen={(x) => go({ name: "product", id: x.id })} />)}
        </div>
      </div>
    </div>
  );
}

const linkBtn = { display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none",
  cursor: "pointer", font: "600 13px/1 var(--ui-font)", color: "var(--ink)", letterSpacing: ".02em", padding: 0 };
const selLabel = { font: "600 13px/1 var(--ui-font)", color: "var(--ink-soft)", marginBottom: 11 };
const qtyBtn = { width: 38, height: 40, display: "grid", placeItems: "center", border: "none", background: "var(--surface)", color: "var(--ink)", cursor: "pointer" };

Object.assign(window, { Home, Catalog, Product });
