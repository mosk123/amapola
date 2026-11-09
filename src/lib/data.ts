import type { Category, ColorKey, ColorInfo, Product } from "@/types";
import { TEST_PRODUCTS, TEST_PRODUCTS_ENABLED } from "./test-products";

// El orden de acá es el de la grilla del inicio, el menú "Filtrar" y el footer
export const CATEGORIES: Category[] = [
  { id: "sweaters",   label: "Sweaters",   blurb: "Abrigo tejido para los días frescos." },
  { id: "remeras",    label: "Remeras",    blurb: "Manga corta, calados y rayas." },
  { id: "pantalones", label: "Pantalones", blurb: "Con cordón y puños acanalados." },
  { id: "vestidos",   label: "Vestidos",   blurb: "Para las ocasiones especiales." },
  { id: "conjuntos",  label: "Conjuntos",  blurb: "Parte de arriba y de abajo que van juntas." },
  { id: "enteritos",  label: "Enteritos",  blurb: "Una sola pieza, de los pies al pecho." },
  { id: "cubrepanal", label: "Cubrepañal", blurb: "Con cordón y puntilla, para los primeros meses." },
  { id: "bodys",      label: "Bodys",      blurb: "Con broches, cómodos para cambiar." },
];

export const COLORS: Record<ColorKey, ColorInfo> = {
  arena:     { label: "Arena",     hex: "#E3D2C0" },
  salvia:    { label: "Salvia",    hex: "#A9B79A" },
  terracota: { label: "Terracota", hex: "#CE8C66" },
  trigo:     { label: "Trigo",     hex: "#D8B98A" },
  rosa:      { label: "Rosa té",   hex: "#E3C4BB" },
  crudo:     { label: "Crudo",     hex: "#EDE6DA" },
  musgo:     { label: "Musgo",     hex: "#7E8E69" },
  azul:      { label: "Azul",      hex: "#2F3B66" },
  celeste:   { label: "Celeste",   hex: "#A9C0DE" },
  blanco:    { label: "Blanco",    hex: "#F6F5F2" },
  verde:     { label: "Verde",     hex: "#7A9A3E" },
  violeta:   { label: "Violeta",   hex: "#5E3A87" },
  // Variantes de body: liso o a rayas
  "1color":   { label: "Cerezo",   hex: "#A7506F" },
  "2colores": { label: "Cerezo y blanco", hex: "repeating-linear-gradient(0deg, #A7506F 0 3px, #FFFFFF 3px 6px)" },
  crema:      { label: "Crema",       hex: "#EFE6D2" },
  verdeclaro: { label: "Lima",        hex: "#9DBF7E" },
  bosque:     { label: "Verde bosque",     hex: "#2F5D3A" },
  marino:     { label: "Marino",      hex: "#1F2F6B" },
  rojo:       { label: "Lacre claro y bordo", hex: "linear-gradient(135deg, #D0504A 50%, #6B1E2E 50%)" },
  lacre:      { label: "Lacre claro", hex: "#D0504A" },
  botella:    { label: "Verde botella", hex: "#1F4D36" },
  azulmarino: { label: "Azul marino", hex: "#1F3A5C" },
  cerezo:     { label: "Cerezo",      hex: "#D9BFB4" },
  arcoiris:   { label: "Arcoíris",    hex: "conic-gradient(#E0B84A, #4FA35B, #D9548F, #E0B84A)" },
  // `hex` se usa como background, así que acepta un gradiente
  multicolor: { label: "Multicolor", hex: "conic-gradient(#CE8C66, #D8B98A, #A9B79A, #A9C0DE, #5E3A87, #CE8C66)" },
};

export const PRODUCTS: Product[] = [
  // Productos de prueba con fotos locales (ver test-products.ts) — van primero para verlos en inicio y catálogo
  ...(TEST_PRODUCTS_ENABLED ? TEST_PRODUCTS : []),
  {
    id: "sweater-otono", name: "Sweater Otoño", cat: "sweaters", audience: "Mujer",
    price: 42000, colors: ["arena", "salvia", "terracota"], sizes: ["XS", "S", "M", "L", "XL"],
    badge: "Más vendido", fiber: "Lana merino",
    short: "Punto trenza grueso, cuello redondo y caída holgada.",
    desc: "Tejido en punto trenza con lana merino hilada en la sierra. Abriga sin pesar y se ablanda con cada lavado. Cada pieza lleva entre dos y tres semanas de trabajo en dos agujas.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832245/Amapola-69_gzv6di.jpg",
    hidden: true,
  },
  {
    id: "cardigan-amapola", name: "Cardigan Amapola", cat: "sweaters", audience: "Mujer",
    price: 48000, colors: ["rosa", "arena", "musgo"], sizes: ["S", "M", "L"],
    badge: "Nuevo", fiber: "Lana + alpaca",
    short: "Saco abierto con botones de coco y bolsillos.",
    desc: "Nuestro clásico: saco abierto de lana y alpaca, con botones de coco cosidos a mano y dos bolsillos al frente. El que te ponés apenas refresca y no te querés sacar.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832245/Amapola-59_yfuuy3.jpg",
    hidden: true,
  },
  {
    id: "pullover-trigo", name: "Pullover Trigo", cat: "sweaters", audience: "Mujer",
    price: 39000, colors: ["trigo", "crudo", "salvia"], sizes: ["XS", "S", "M", "L"],
    fiber: "Algodón orgánico",
    short: "Punto liviano de media estación, cuello alto suave.",
    desc: "Pensado para el entretiempo: algodón orgánico en punto liviano, cuello alto que no aprieta. Va igual de bien con jean que con un vestido largo.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832245/Amapola-23_zgctvv.jpg",
    hidden: true,
  },
  {
    id: "sweater-nube", name: "Sweater Nube", cat: "sweaters", audience: "Clásico",
    price: 26000, colors: ["crudo", "salvia", "rosa"], sizes: ["2", "4", "6", "8"],
    fiber: "Algodón pima",
    short: "Para peques: suave, sin etiquetas que molesten.",
    desc: "Algodón pima bien suave, sin costuras ásperas ni etiquetas que pican. Tejido pensado para que el abrigo de los más chicos sea un mimo, no una pelea.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832245/Amapola-18_hwzfix.jpg",
    hidden: true, // foto vieja de Cloudinary
  },
  {
    id: "medias-lana", name: "Medias Lana Cruda", cat: "accesorios", audience: "Unisex",
    price: 9500, colors: ["crudo", "musgo", "terracota"], sizes: ["35-38", "39-42"],
    badge: "Más vendido", fiber: "Lana cruda",
    short: "Medias gruesas de invierno, puño acanalado.",
    desc: "Las medias de invierno que faltaban: lana cruda gruesa, puño acanalado que no se cae y talón reforzado. Para andar por casa o meter en la bota.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832245/Amapola-58_vc3j21.jpg",
    hidden: true,
  },
  {
    id: "guantes-hoja", name: "Guantes Hoja", cat: "accesorios", audience: "Mujer",
    price: 12000, colors: ["salvia", "arena", "rosa"], sizes: ["Único"],
    fiber: "Lana merino",
    short: "Mitones con detalle de hoja tejido al dorso.",
    desc: "Mitones que dejan los dedos libres, con un dibujo de hoja tejido al dorso. Lana merino que no raspa, para el celular, el mate y las manos frías.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832244/Amapola-08_yjs3kf.jpg",
    hidden: true,
  },
  {
    id: "gorro-pompon", name: "Gorro Pompón", cat: "accesorios", audience: "Clásico",
    price: 11000, colors: ["rosa", "salvia", "trigo"], sizes: ["1-3", "4-7"],
    fiber: "Lana + algodón",
    short: "Gorro con pompón desmontable y orejeras.",
    desc: "Gorro con orejeras y un pompón bien grande que se puede sacar para lavar. Tejido en lana con algodón para que abrigue sin picar la frente.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832244/Amapola-38_sc6azn.jpg",
    hidden: true, // foto vieja de Cloudinary
  },
  {
    id: "cuello-salvia", name: "Cuello Salvia", cat: "accesorios", audience: "Mujer",
    price: 14500, colors: ["salvia", "musgo", "arena"], sizes: ["Único"],
    fiber: "Lana merino",
    short: "Cuello infinito de punto inglés, doble vuelta.",
    desc: "Cuello infinito en punto inglés, lo bastante largo para dar dos vueltas. Reemplaza a la bufanda y no se desarma cuando te sacás el abrigo.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832243/Amapola-32_slroia.jpg",
    hidden: true,
  },
  {
    id: "manta-telar", name: "Manta Telar", cat: "mantas", audience: "Hogar",
    price: 68000, colors: ["arena", "terracota", "musgo"], sizes: ["1,40 × 1,80 m"],
    badge: "Edición limitada", fiber: "Lana de oveja",
    short: "Manta grande de telar, flecos anudados a mano.",
    desc: "Tejida en telar con lana de oveja sin teñir y teñidos naturales. Flecos anudados uno por uno. Es la manta que queda sobre el respaldo del sillón todo el invierno.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832243/Amapola-25_mvblh4.jpg",
    hidden: true,
  },
  {
    id: "manta-bebe", name: "Manta Bebé Nube", cat: "mantas", audience: "Clásico",
    price: 34000, colors: ["crudo", "rosa", "salvia"], sizes: ["80 × 90 cm"],
    fiber: "Algodón pima",
    short: "Mantita de cuna en punto nube, súper liviana.",
    desc: "Punto nube en algodón pima, liviana y transpirable para la cuna o el cochecito. Tamaño justo para envolver sin que sobre. Un regalo de nacimiento que dura.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832243/Amapola-01_hhy4yc.jpg",
    hidden: true, // foto vieja de Cloudinary
  },
  {
    id: "throw-cosecha", name: "Throw Cosecha", cat: "mantas", audience: "Hogar",
    price: 58000, colors: ["trigo", "terracota", "arena"], sizes: ["1,20 × 1,60 m"],
    fiber: "Lana + algodón",
    short: "Manta de sillón en bloques de color cosecha.",
    desc: "Bloques de color en tonos de cosecha —trigo, terracota, arena— tejidos en lana y algodón. Da calidez a un sillón neutro sin tapar el resto de la casa.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832244/Amapola-13_wyyceo.jpg",
    hidden: true,
  },

  // -- Repetidos a modo de preview de "Colores" y "Animales" — placeholders hasta tener productos reales de cada línea --
  {
    id: "sweater-nube-colores", name: "Sweater Nube", cat: "sweaters", audience: "Colores",
    price: 26000, colors: ["crudo", "salvia", "rosa"], sizes: ["2", "4", "6", "8"],
    fiber: "Algodón pima",
    short: "Para peques: suave, sin etiquetas que molesten.",
    desc: "Algodón pima bien suave, sin costuras ásperas ni etiquetas que pican. Tejido pensado para que el abrigo de los más chicos sea un mimo, no una pelea.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832245/Amapola-18_hwzfix.jpg",
    hidden: true, // foto vieja de Cloudinary
  },
  {
    id: "gorro-pompon-colores", name: "Gorro Pompón", cat: "accesorios", audience: "Colores",
    price: 11000, colors: ["rosa", "salvia", "trigo"], sizes: ["1-3", "4-7"],
    fiber: "Lana + algodón",
    short: "Gorro con pompón desmontable y orejeras.",
    desc: "Gorro con orejeras y un pompón bien grande que se puede sacar para lavar. Tejido en lana con algodón para que abrigue sin picar la frente.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832244/Amapola-38_sc6azn.jpg",
    hidden: true, // foto vieja de Cloudinary
  },
  {
    id: "manta-bebe-colores", name: "Manta Bebé Nube", cat: "mantas", audience: "Colores",
    price: 34000, colors: ["crudo", "rosa", "salvia"], sizes: ["80 × 90 cm"],
    fiber: "Algodón pima",
    short: "Mantita de cuna en punto nube, súper liviana.",
    desc: "Punto nube en algodón pima, liviana y transpirable para la cuna o el cochecito. Tamaño justo para envolver sin que sobre. Un regalo de nacimiento que dura.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832243/Amapola-01_hhy4yc.jpg",
    hidden: true, // foto vieja de Cloudinary
  },
  {
    id: "sweater-nube-colores-2", name: "Sweater Nube", cat: "sweaters", audience: "Colores",
    price: 26000, colors: ["crudo", "salvia", "rosa"], sizes: ["2", "4", "6", "8"],
    fiber: "Algodón pima",
    short: "Para peques: suave, sin etiquetas que molesten.",
    desc: "Algodón pima bien suave, sin costuras ásperas ni etiquetas que pican. Tejido pensado para que el abrigo de los más chicos sea un mimo, no una pelea.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832245/Amapola-18_hwzfix.jpg",
    hidden: true, // foto vieja de Cloudinary
  },
  {
    id: "sweater-nube-animales", name: "Sweater Nube", cat: "sweaters", audience: "Animales",
    price: 26000, colors: ["crudo", "salvia", "rosa"], sizes: ["2", "4", "6", "8"],
    fiber: "Algodón pima",
    short: "Para peques: suave, sin etiquetas que molesten.",
    desc: "Algodón pima bien suave, sin costuras ásperas ni etiquetas que pican. Tejido pensado para que el abrigo de los más chicos sea un mimo, no una pelea.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832245/Amapola-18_hwzfix.jpg",
    hidden: true, // foto vieja de Cloudinary
  },
  {
    id: "gorro-pompon-animales", name: "Gorro Pompón", cat: "accesorios", audience: "Animales",
    price: 11000, colors: ["rosa", "salvia", "trigo"], sizes: ["1-3", "4-7"],
    fiber: "Lana + algodón",
    short: "Gorro con pompón desmontable y orejeras.",
    desc: "Gorro con orejeras y un pompón bien grande que se puede sacar para lavar. Tejido en lana con algodón para que abrigue sin picar la frente.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832244/Amapola-38_sc6azn.jpg",
    hidden: true, // foto vieja de Cloudinary
  },
  {
    id: "manta-bebe-animales", name: "Manta Bebé Nube", cat: "mantas", audience: "Animales",
    price: 34000, colors: ["crudo", "rosa", "salvia"], sizes: ["80 × 90 cm"],
    fiber: "Algodón pima",
    short: "Mantita de cuna en punto nube, súper liviana.",
    desc: "Punto nube en algodón pima, liviana y transpirable para la cuna o el cochecito. Tamaño justo para envolver sin que sobre. Un regalo de nacimiento que dura.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832243/Amapola-01_hhy4yc.jpg",
    hidden: true, // foto vieja de Cloudinary
  },
  {
    id: "gorro-pompon-animales-2", name: "Gorro Pompón", cat: "accesorios", audience: "Animales",
    price: 11000, colors: ["rosa", "salvia", "trigo"], sizes: ["1-3", "4-7"],
    fiber: "Lana + algodón",
    short: "Gorro con pompón desmontable y orejeras.",
    desc: "Gorro con orejeras y un pompón bien grande que se puede sacar para lavar. Tejido en lana con algodón para que abrigue sin picar la frente.",
    image: "https://res.cloudinary.com/ddtqy6ltq/image/upload/v1786832244/Amapola-38_sc6azn.jpg",
    hidden: true, // foto vieja de Cloudinary
  },
];

/** Productos activos en catálogo público (excluye los ocultos por el rebrand a solo-niños). */
export const CATALOG_PRODUCTS: Product[] = PRODUCTS.filter((p) => !p.hidden);

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(cat: string): Product[] {
  if (!cat || cat === "todo") return CATALOG_PRODUCTS;
  return CATALOG_PRODUCTS.filter((p) => p.cat === cat);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return CATALOG_PRODUCTS.filter((p) => p.cat === product.cat && p.id !== product.id).slice(0, limit);
}

/** Sugerencias para el carrito — prioriza la misma categoría que lo que ya está en el carrito, sin repetir productos ya agregados ni duplicar por nombre (varios ids comparten foto/nombre como preview de Colores/Animales). */
export function getCrossSellProducts(cartItems: { id: string; name: string; cat: string }[], limit = 3): Product[] {
  const cartIds = new Set(cartItems.map((it) => it.id));
  const cartNames = new Set(cartItems.map((it) => it.name));
  const cartCats = new Set(cartItems.map((it) => it.cat));
  const seenNames = new Set<string>();

  const pick = (pool: Product[]) =>
    pool.filter((p) => {
      if (cartIds.has(p.id) || cartNames.has(p.name) || seenNames.has(p.name)) return false;
      seenNames.add(p.name);
      return true;
    });

  const sameCategory = pick(CATALOG_PRODUCTS.filter((p) => cartCats.has(p.cat)));
  const rest = pick(CATALOG_PRODUCTS);

  return [...sameCategory, ...rest].slice(0, limit);
}

/** Fotos a mostrar para un color: las del color, si no las "default", si no las del primer color que tenga, si no `image`. */
export function getImages(p: Product, color?: ColorKey): string[] {
  const g = p.gallery;
  if (g) {
    // Un color sin fotos propias usa "default"; si tampoco hay, queda el placeholder (no se muestran fotos de otro color)
    const list = color
      ? g[color] ?? g.default
      : g.default ?? Object.values(g).find((l) => l && l.length > 0);
    if (list && list.length > 0) return list;
  }
  return p.image ? [p.image] : [];
}

/** Fotos de portada del producto (vacío si no tiene). */
export function getCover(p: Product): string[] {
  if (!p.cover) return [];
  return Array.isArray(p.cover) ? p.cover : [p.cover];
}

export function fmt(n: number): string {
  return "$" + n.toLocaleString("es-AR");
}

export function toneFor(p: Product): "blush" | "sage" | "caramel" | "rosa" {
  const c = p.colors[0];
  if (["salvia", "musgo"].includes(c)) return "sage";
  if (c === "rosa") return "rosa";
  if (["arena", "trigo", "crudo"].includes(c)) return "caramel";
  return "blush";
}

/** Talles con stock para un color (sin `stock` definido = todos). */
export function availableSizes(p: Product, color?: ColorKey | null): string[] {
  if (!p.stock) return p.sizes;
  if (!color) {
    // Sin color elegido: los talles que hay en algún color
    const any = new Set(Object.values(p.stock).flat());
    return p.sizes.filter((s) => any.has(s));
  }
  const list = p.stock[color] ?? p.stock.default ?? [];
  return p.sizes.filter((s) => list.includes(s));
}

/**
 * Valida en el servidor que una línea del carrito se pueda comprar: producto visible,
 * color existente y no agotado, talle con stock (o las piezas del conjunto), 1 unidad.
 * Devuelve el producto o un mensaje de error.
 */
export function validateCartLine(item: { id: string; color: string; size: string; qty: number }):
  { product: Product } | { error: string } {
  const product = getProductById(item.id);
  if (!product || product.hidden) return { error: `Producto inválido: ${item.id}` };
  const color = item.color as ColorKey;
  if (!product.colors.includes(color)) return { error: `Color inválido para ${product.name}` };
  if (product.soldOut?.includes(color)) return { error: `${product.name} (${COLORS[color]?.label}) está agotado` };
  if (Math.floor(item.qty) !== 1) return { error: `${product.name}: cada prenda es única, se puede comprar 1` };
  const pieces = product.pieces?.[color];
  const okSize = pieces
    ? item.size === pieces.map((pc) => `${pc.name} ${pc.size}`).join(" · ")
    : availableSizes(product, color).includes(item.size);
  if (!okSize) return { error: `${product.name}: el talle ${item.size} no está disponible` };
  return { product };
}
