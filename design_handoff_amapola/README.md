# Handoff: Amapola — Tienda de Tejidos Artesanales

## Overview
Amapola es un ecommerce de ropa y accesorios tejidos a mano (sweaters, accesorios y mantas) para mujeres, niños y hogar. Este paquete documenta un prototipo de alta fidelidad, navegable, con: Home, Catálogo (con filtros), Detalle de producto, Carrito (drawer), y las páginas institucionales Nosotras / Las Tejedoras, Cuidados y Contacto. La identidad es cálida, hogareña y natural/eco, con paleta pastel construida a partir del logo (amapola dibujada a mano sobre rosa empolvado).

## About the Design Files
Los archivos de este bundle son **referencias de diseño hechas en HTML/React (vía Babel en el navegador)** — prototipos que muestran el look & feel y el comportamiento buscado, **no código de producción para copiar tal cual**. La tarea es **recrear estos diseños en el entorno del codebase destino** (Next.js/React, Astro, Vue, etc.) usando sus patrones, su router y su librería de estilos establecidos. Si todavía no hay codebase, se recomienda **Next.js (App Router) + React + CSS Modules o Tailwind**, que mapean bien a la estructura de tokens y componentes de acá.

> El prototipo usa CSS custom properties (variables) para TODO el theming. Esa estructura de tokens debería trasladarse 1:1 al sistema de estilos del proyecto destino.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografía, espaciados, radios, sombras e interacciones son definitivos (dentro de dos direcciones visuales A/B intercambiables). Las **fotos son placeholders** (rayado diagonal con etiqueta) y deben reemplazarse por fotos reales de producto. Recrear la UI pixel-perfect con la librería de componentes del codebase.

## Dos direcciones visuales (A/B)
El prototipo soporta dos temas conmutables en runtime (panel de Tweaks). El equipo debe **elegir UNA** para producción (o dejar ambas como theme):
- **Dirección A · "Boutique cálido"** (default): fondo crema rosado, acento terracota, títulos serif (Cormorant Garamond), esquinas redondeadas (radius 18px, botones pill 999px), títulos en sentence-case con énfasis en *itálica*.
- **Dirección B · "Natural orgánico"**: fondo avena/lino, acento verde salvia, títulos sans (Nunito Sans) en MAYÚSCULAS con tracking, esquinas casi rectas (radius 6px, botones 4px), sombras más sutiles.

Ambas comparten layout, tipografía de cuerpo (Nunito Sans) y tipografía mono de detalle (IBM Plex Mono).

---

## Design Tokens

Definidos como CSS custom properties en `:root` (ver `buildTheme()` en `app.jsx`). Valores para **Dirección A (default)** / **Dirección B**:

### Colores
| Token | Rol | Dirección A | Dirección B |
|---|---|---|---|
| `--bg` | Fondo base | `#FBF6F1` | `#F4F2EA` |
| `--bg-2` | Fondo secundario / chips | `#F3E7DD` | `#E9E6D9` |
| `--surface` | Tarjetas, inputs | `#FFFFFF` | `#FFFFFF` |
| `--hero-bg` | Fondo de héroes | `#F3E7DD` | `#EDEBE0` |
| `--ink` | Texto principal / footer bg | `#3B302A` | `#373C30` |
| `--ink-soft` | Texto secundario | `#6E5F54` | `#5E6351` |
| `--muted` | Texto terciario / mono | `#9C8C7E` | `#8B8F77` |
| `--line` | Bordes suaves | `#EBDFD4` | `#E1DECF` |
| `--line-strong` | Bordes marcados | `#D8C8BA` | `#CFCBB7` |
| `--accent` | Acento (botones, links) | `#CE8C66` (terracota) | `#7E9266` (salvia) |
| `--accent-ink` | Texto sobre acento | `#FFFFFF` | `#FFFFFF` |
| `--blush` | Tono placeholder foto | `#E7D4C9` | `#E7D4C9` |

Acentos alternativos ofrecidos en Tweaks: `#CE8C66`, `#7E9266`, `#C6A57C`, `#CBA0A0`, `#A98C73`.

### Paleta de colores de producto (swatches en fichas)
`arena #E3D2C0` · `salvia #A9B79A` · `terracota #CE8C66` · `trigo #D8B98A` · `rosa té #E3C4BB` · `crudo #EDE6DA` · `musgo #7E8E69`

### Tipografía
- **Cuerpo / UI** (`--ui-font`): `'Nunito Sans', sans-serif` (Google Fonts; pesos 400/500/600/700/800; opsz 6..12)
- **Títulos** (`--head-fam`): Dirección A `'Cormorant Garamond', Georgia, serif` (600) · Dirección B `'Nunito Sans', sans-serif` (800). Alternativa ofrecida: `'Playfair Display', serif`.
- **Detalle / mono**: `'IBM Plex Mono', monospace` (400/500) — usado en etiquetas, precios-unidad, metadatos, badges pequeños. Tracking 0.04–0.18em según uso.

Escala de títulos (font shorthand `weight size/line-height family`):
| Token | Dirección A | Dirección B |
|---|---|---|
| `--h1-font` | `600 clamp(34px,4vw,46px)/1.16` | `800 clamp(28px,3.4vw,42px)/1.16` |
| `--h2-font` | `600 clamp(26px,3vw,36px)/1.2` | `800 clamp(22px,2.6vw,30px)/1.18` |
| `--h3-font` | `600 22px/1.2` | `700 17px/1.25` |
| `--card-title-font` | `600 18px/1.25` | `700 15px/1.3` |
| `--stat-font` | `600 25px/1` | `800 22px/1` |

Transforms de títulos: A `none` / B `uppercase` con `--head-tracking` A `0` / B `.05em`. Énfasis `<em>`: A `italic` / B `normal`.

### Radios
| Token | Dirección A | Dirección B |
|---|---|---|
| `--radius` (tarjetas, secciones) | `18px` | `6px` |
| `--radius-sm` (chips de icono, thumbs) | `12px` | `5px` |
| `--btn-radius` (botones, inputs, chips) | `999px` | `4px` |

Ajustable vía slider de Tweaks 0–24px (afecta `--radius`).

### Sombras
- A: `--shadow: 0 10px 30px -16px rgba(80,55,40,.28)` · `--shadow-hover: 0 18px 40px -16px rgba(80,55,40,.4)`
- B: `--shadow: 0 1px 0 0 var(--line)` (casi flat) · `--shadow-hover: 0 10px 26px -16px rgba(55,60,48,.35)`

### Espaciado y layout
- Contenedor: `.wrap { max-width: 1240px; margin: 0 auto; }`
- Padding horizontal global: `--pad: clamp(20px, 5vw, 64px)`
- Padding vertical de secciones: `clamp(40px–48px, 6vw, 80–84px)`
- Gaps de grilla típicos: 20–28px. Gaps de columna en héroes: `clamp(28px,4vw,60px)`.
- Botones: padding sm `9px 16px`, md `13px 24px`, lg `16px 32px`. Peso 700, letter-spacing .02em.

---

## Screens / Views

### 1. Navbar (sticky, global)
- **Layout**: flex horizontal, sticky top, `background: color-mix(in srgb, var(--bg) 88%, transparent)` + `backdrop-filter: blur(10px)`, borde inferior `--line`. Padding `12px var(--pad)`.
- **Izquierda**: logo circular 46px + wordmark "AMAPOLA" (título serif/sans, 22px, tracking .06em) con sublínea "TEJIDOS ARTESANALES" (IBM Plex Mono 9px, tracking .18em, `--muted`).
- **Centro**: links — Inicio, Catálogo, Nosotras, Cuidados, Contacto. Activo: color `--ink` + subrayado `--accent` (offset 6px, thickness 2px). Inactivo: `--ink-soft`.
- **Derecha**: 3 icon-buttons circulares 40px — Buscar (search), Favoritos (heart), Carrito (cart). El carrito lleva badge contador (círculo `--accent`, 17px, número blanco) cuando hay items.

### 2. Home
Secciones en orden:
1. **Hero**: grid 2 col (1.05fr / 0.95fr), fondo `--hero-bg`. Izquierda: eyebrow "Tejidos artesanales · desde 2019", H1 con `<em>` en acento ("Abrigo tejido a mano, *una pieza a la vez*"), párrafo, 2 botones (solid "Ver catálogo" + outline "Sweaters"), fila de 3 stats. Derecha: foto 4/5 + insignia circular flotante (132px) con el logo, posicionada `bottom:-22px; left:-22px`.
2. **Categorías**: header de sección + "Ver todo". Grid 3 col, cada card = foto 3/4 + título + blurb. Click → catálogo filtrado por categoría.
3. **Destacados**: fondo `--bg-2`. Título centrado + grid 4 col de `ProductCard` (los productos con badge).
4. **Hecho a mano**: grid 3 col, cada item = chip de icono (hand/leaf/truck) + título + texto.

### 3. Catálogo
- **Header**: eyebrow "Catálogo" + H2 "Nuestra colección".
- **Barra de filtros** (borde inferior): izquierda = chips de categoría (Todo / Sweaters / Accesorios / Mantas). Derecha = chips de público (Todos / Mujer / Niños / Hogar) + `<select>` de orden (Destacados / Precio menor→mayor / mayor→menor).
- **Contador**: "N prendas" (mono, `--muted`).
- **Grid**: `repeat(var(--cat-cols,4), 1fr)` (Tweak 3 o 4 columnas), gap 24px, de `ProductCard`.

### 4. Detalle de producto
- **Volver al catálogo** (link con icono back).
- **Grid 2 col**:
  - **Izquierda (sticky, top:92px)**: foto principal 4/5 + 4 thumbnails (grid 4 col); thumb activo con borde `--accent` 2px.
  - **Derecha**: eyebrow categoría + badge opcional; H1 nombre; precio 26px + 5 estrellas acento + "(28 reseñas)"; descripción; selector de **color** (círculos 38px, activo con borde `--ink` 2px) con label dinámico; selector de **talle** (chips); **cantidad** (stepper −/+) + botón "Agregar al carrito" (cambia a "Agregado" con check 1.8s); bloque de detalles (fibra / tejido a mano 2-3 sem / envío gratis desde $60.000).
- **Relacionados**: H2 "También tejimos" + grid 3 col del mismo `cat`.

### 5. Carrito (drawer lateral derecho)
- **Overlay** `rgba(50,38,30,.32)` + panel `min(420px,92vw)` deslizante (`translateX`, transición .3s cubic-bezier(.4,0,.2,1)).
- **Header**: "Tu carrito" + cerrar.
- **Vacío**: icono cart grande + mensaje + botón "Ver catálogo".
- **Con items**: lista scrollable, cada línea = thumb 76px + nombre + (color · talle en mono) + stepper qty + subtotal de línea + quitar. **Footer**: subtotal + barra de envío gratis ("Te faltan $X para envío gratis" / "✓ envío gratis" a partir de $60.000) + botón "Finalizar compra".

### 6. Nosotras (about)
1. **Intro** centrada (fondo `--hero-bg`): eyebrow + H1 "Tejido con tiempo, *hecho con cariño*" + párrafo.
2. **Historia**: grid 2 col, foto 4/5 + texto ("De un regalo a un taller") con 3 stats (2019 / 4 tejedoras / +1.200 prendas).
3. **Valores**: fondo `--bg-2`, grid 3 col (Tiempo justo / Fibras nobles / Manos que saben) con icono.
4. **Las Tejedoras**: grid 4 col de cards = foto circular (1/1, border-radius 50%) + nombre + ubicación (pin + mono) + bio + 2 tags (oficio, años). Datos en const `TEJEDORAS` (placeholder — reemplazar por reales).
5. **CTA** (fondo `--ink`): título + botón a catálogo.

### 7. Cuidados (care)
1. **Intro** centrada: H1 "Para que te dure *muchos inviernos*".
2. **6 pasos**: grid 3 col, cada card (surface, shadow) = chip de icono + número "0N" mono + título + texto. Iconos: droplet, air, sun, box, sparkle, hand.
3. **Lana vs algodón**: grid 2 col, dos cards `--bg-2` con icono leaf.
4. **CTA** → Contacto.

### 8. Contacto (contact)
- Intro centrada: H1 "Escribinos, *te leemos*".
- **Grid 2 col (1.15fr / 0.85fr)**:
  - **Formulario** (card surface): Nombre + Email (2 col), `<select>` asunto, `<textarea>` mensaje, botón "Enviar mensaje". Al enviar (`preventDefault`) muestra estado de éxito (check + mensaje + "Enviar otro"). Validación: required en nombre/email/mensaje, type=email.
  - **Canales**: 4 cards `--bg-2` = icono + label (mono mayúsculas) + valor + nota. WhatsApp / Email / Instagram / El taller (datos placeholder).

### 9. Footer (global)
- Fondo `--ink`, texto `--bg`. Grid 4 col: bloque marca + "Tienda" (links a catálogo filtrado) + "Amapola" (Nosotras/Tejedoras/Cuidados/Contacto) + "Sumate al club" (input email + botón). Barra inferior: copyright + "Prototipo · hecho con cariño".

---

## Interactions & Behavior
- **Ruteo**: estado `route = { name, ...params }` en el componente `App`; `go(route)` setea y hace `scrollTo(top:0)`. Nombres: `home`, `catalog` (param `cat`), `product` (param `id`), `about`, `care`, `contact`. En producción: usar el router del framework (rutas reales `/`, `/catalogo`, `/producto/[id]`, `/nosotras`, `/cuidados`, `/contacto`).
- **Carrito**: estado array `cart`; `addToCart` agrega y abre el drawer; qty editable por línea (mín 1); subtotal y umbral de envío gratis ($60.000) calculados.
- **Hover**: cards suben `translateY(-3px)` + sombra hover; botón solid `brightness(.95)` + `translateY(-1px)`; outline invierte a fondo `--ink`; aparece botón corazón sobre la foto (opacity 0→1).
- **Agregar al carrito**: feedback temporal "Agregado" + icono check, 1800ms.
- **Drawer**: transición transform .3s; overlay fade .25s.
- **Formulario contacto**: submit local → vista de éxito (sin backend; conectar a endpoint real).
- **Responsive**: las grillas de 2 col colapsan a 1 col < 900px (ver media query). El resto necesita trabajo de responsive en producción (móvil aún no pulido — pendiente).

## State Management
- `route` (objeto): navegación.
- `cart` (array de `{...product, color, size, qty}`): ítems del carrito.
- `cartOpen` (bool): drawer.
- Por producto: `color`, `size`, `qty`, `activeImg`, `added`.
- Catálogo: `cat`, `aud`, `sort`.
- Contacto: `sent` (bool).
- Tema: tweaks `direccion`, `acento`, `titulos`, `esquinas`, `columnas` → aplicados como CSS vars en `:root`.

## Assets
- **`assets/amapola-logo.png`** (464×464, circular, fondo rosa empolvado): logo de marca, provisto por el cliente. Único asset real; incluido en el bundle.
- **Fotos de producto**: NO incluidas — son placeholders (`<Photo>` con rayado diagonal). Reemplazar por fotos reales (ratios usados: 1/1, 3/4, 4/5).
- **Iconos**: SVG inline de trazo (1.6px), definidos en `Icon` (`components.jsx`). En producción se pueden sustituir por una librería (Lucide/Feather son muy parecidos): cart, search, heart, arrow, back, plus, minus, check, star, leaf, truck, hand, mail, pin, chat, instagram, clock, droplet, sun, air, box, sparkle.
- **Fuentes**: Google Fonts — Cormorant Garamond, Playfair Display, Nunito Sans, IBM Plex Mono.

## Screenshots
La carpeta `screenshots/` incluye capturas de referencia (Dirección A salvo la última) en alta resolución, numeradas de arriba hacia abajo por página:
- `01–04-home.png` — Home: hero / categorías / destacados / hecho-a-mano.
- `01–02-catalogo.png` — Catálogo con filtros y grilla.
- `01–03-producto.png` — Detalle de producto (incluye estado "Agregado" + badge de carrito).
- `03-carrito.png` — Drawer del carrito abierto con un ítem.
- `01–04-nosotras.png` — Nosotras: intro / historia / valores / Las Tejedoras.
- `01–03-cuidados.png` — Cuidados: intro / 6 pasos / lana vs algodón.
- `01–02-contacto.png` — Contacto: formulario + canales.
- `01–03-direccion-b.png` — **Dirección B** (tema natural/salvia) como referencia del theme alternativo; `02` muestra el panel de Tweaks A/B abierto.

> Las fotos de producto aparecen como placeholders rayados a propósito (pendiente de reemplazo por fotos reales).

## Files (en este bundle)
- `Amapola.html` — entry point; carga fuentes, monta React/Babel e importa los .jsx.
- `app.jsx` — `App` (estado + ruteo + theming), `Nav`, `CartDrawer`, `Footer`, `buildTheme()` (todos los tokens A/B), defaults de Tweaks.
- `pages.jsx` — `Home`, `Catalog`, `Product`, `Chip`.
- `pages2.jsx` — `About`, `Care`, `Contact`, `CTA`, const `TEJEDORAS`.
- `components.jsx` — `Icon`, `Photo` (placeholder), `Btn`, `ColorDots`, `ProductCard`, `Eyebrow`, `fmt` (formato de precio es-AR).
- `data.jsx` — `CATEGORIES`, `COLORS`, `PRODUCTS` (catálogo de ejemplo, 11 productos).
- `tweaks-panel.jsx` — panel de ajustes en vivo (solo para el prototipo; NO portar a producción).
- `assets/amapola-logo.png` — logo.

> **Nota de implementación**: `buildTheme()` en `app.jsx` es la fuente de verdad de TODOS los tokens. Empezar por ahí para construir el theme del codebase. El precio se formatea con `toLocaleString("es-AR")` con prefijo `$` (pesos argentinos).
