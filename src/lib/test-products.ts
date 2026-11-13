import type { MeasureTable, Product } from "@/types";
import { cld } from "./cloudinary";

/*
 * Productos de PRUEBA con fotos locales — para ver cómo quedan las fotos reales
 * antes de pasarlas a Cloudinary y cargar los productos en la base de datos.
 *
 * Fotos en Cloudinary: amapola/productos/<carpeta>/ (originales en public/images/products/, sin subir al repo)
 *   - Sin colores:          body-1.jpg, body-2.jpg ...         → gallery.default
 *   - Con colores:          azul-1.jpg, azul-2.jpg ...         → gallery.<color>
 *   - Portada de la card:   pantalon.jpg (todos los colores)   → cover
 * La card muestra la portada (o la foto 1); en el detalle se pasan las demás.
 *
 * Los colores válidos son las claves de COLORS en data.ts.
 * Para sacarlos de la web: poner TEST_PRODUCTS_ENABLED en false.
 *
 * Precios, talles, stock y medidas: planilla "Medidas amapola.xlsx". Nombres y textos son provisorios.
 * `cat` define en qué botón de categoría del catálogo aparece (ids de CATEGORIES en data.ts).
 * Una categoría sin botón en CATEGORIES solo se ve en "Todo".
 */
export const TEST_PRODUCTS_ENABLED = true;

const BASE = cld("").replace(/\/$/, ""); // fotos en Cloudinary: amapola/productos/<carpeta>/

/** serie("body", "body", 7) → [".../body/body-1.jpg", ... "body-7.jpg"] */
const serie = (dir: string, prefix: string, count: number) =>
  Array.from({ length: count }, (_, i) => `${BASE}/${dir}/${prefix}-${i + 1}.jpg`);

// Talles (planilla de medidas)
const TALLES = ["RN-3 m", "3-6 m", "6-9 m", "9-12 m", "12-18 m", "18-24 m"];
const TALLES_BODY = TALLES.slice(0, 4);            // RN-3 a 9-12 m
const TALLES_VESTIDO = ["6-9 m", "6-12 m", "12-18 m", "18-24 m"];
const TALLES_CUBREPANAL = ["0-6 m", "6-12 m"];
// Guía de talles — medidas en cm (planilla "Medidas amapola.xlsx")
const M_PANTALON: MeasureTable = { title: "Pantalón", shape: "bottom", rows: [
  { size: "RN-3 m", largo: 28, ancho: 20 }, { size: "3-6 m", largo: 31, ancho: 21 },
  { size: "6-9 m", largo: 37, ancho: 23.5 }, { size: "9-12 m", largo: 42, ancho: 25 },
  { size: "12-18 m", largo: 46, ancho: 27 }, { size: "18-24 m", largo: 50, ancho: 29 },
] };
const M_SHORT: MeasureTable = { title: "Short", shape: "bottom", rows: [
  { size: "RN-3 m", largo: 21, ancho: 22 }, { size: "3-6 m", largo: 23, ancho: 23 },
  { size: "6-9 m", largo: 24, ancho: 26 }, { size: "9-12 m", largo: 26, ancho: 28 },
  { size: "12-18 m", largo: 30, ancho: 29 }, { size: "18-24 m", largo: 32, ancho: 30 },
] };
const M_REMERA: MeasureTable = { title: "Remera", shape: "top", rows: [
  { size: "RN-3 m", largo: 20, ancho: 22, sisa: 9 }, { size: "3-6 m", largo: 24, ancho: 24, sisa: 10 },
  { size: "6-9 m", largo: 27, ancho: 26, sisa: 12 }, { size: "9-12 m", largo: 30, ancho: 29, sisa: 13 },
  { size: "12-18 m", largo: 33, ancho: 29, sisa: 14 }, { size: "18-24 m", largo: 36, ancho: 30, sisa: 15 },
] };
const M_SWEATER: MeasureTable = { title: "Sweater", shape: "top", rows: [
  { size: "RN-3 m", largo: 24, ancho: 22, sisa: 9, manga: 13 }, { size: "3-6 m", largo: 27, ancho: 24, sisa: 10, manga: 16 },
  { size: "6-9 m", largo: 28, ancho: 26, sisa: 12, manga: 19 }, { size: "9-12 m", largo: 30, ancho: 29, sisa: 13, manga: 21 },
  { size: "12-18 m", largo: 33, ancho: 29, sisa: 14, manga: 23 }, { size: "18-24 m", largo: 36, ancho: 30, sisa: 15, manga: 24 },
] };
const M_CUBREPANAL: MeasureTable = { title: "Cubrepañal", shape: "bottom", rows: [
  { size: "0-6 m", largo: 18, ancho: 18 },
] };
const M_ENTERITO: MeasureTable = { title: "Enterito", shape: "top", rows: [
  { size: "RN-3 m", largo: 31, ancho: 22 },
] };
const M_BODY: MeasureTable = { title: "Body", shape: "top", rows: [
  { size: "RN-3 m", largo: 37, ancho: 20 }, { size: "3-6 m", largo: 39, ancho: 21 },
  { size: "6-9 m", largo: 41, ancho: 22 }, { size: "9-12 m", largo: 43, ancho: 23 },
] };
const M_VESTIDO: MeasureTable = { title: "Vestido", shape: "top", rows: [
  { size: "6-9 m", largo: 36, ancho: "23-25" }, { size: "6-12 m", largo: 40, ancho: "25-27" },
  { size: "12-18 m", largo: 45, ancho: "27-29" }, { size: "18-24 m", largo: 48, ancho: "28-30" },
] };

const TEXTO = "Descripción de prueba. Reemplazar por la descripción real del producto.";

export const TEST_PRODUCTS: Product[] = [
  // Son dos modelos distintos (no el mismo en dos colores): un producto cada una
  {
    id: "remera-calada", name: "Remera Calada", cat: "remeras", audience: "Clásico",
    price: 45000, colors: ["verde"], sizes: TALLES,
    stock: { verde: ["12-18 m"] },
    measures: [M_REMERA],
    composition: "Hilo de algodón 8/3",
    badge: "Nuevo", fiber: "Algodón",
    short: "Remera de manga corta con calado en la cintura.", desc: TEXTO,
    gallery: { verde: serie("remera", "remeraVerde", 3) },
  },
  {
    id: "remera-violeta", name: "Remera Violeta", cat: "remeras", audience: "Clásico",
    price: 45000, colors: ["violeta"], sizes: TALLES,
    stock: { violeta: ["6-9 m"] },
    measures: [M_REMERA],
    composition: "Hilo de algodón 8/3",
    badge: "Nuevo", fiber: "Algodón",
    short: "Remera de manga corta.", desc: TEXTO,
    gallery: { violeta: serie("remera", "remeraVioleta", 3) },
  },
  {
    id: "sweater", name: "Sweater", cat: "sweaters", audience: "Clásico",
    price: 45000, colors: ["azul", "cerezo"], sizes: TALLES,
    stock: { azul: ["RN-3 m"], cerezo: ["3-6 m"] },
    measures: [M_SWEATER],
    composition: "Hilo de algodón 8/6",
    badge: "Nuevo", fiber: "Algodón",
    short: "Sweater con botones al hombro.", desc: TEXTO,
    gallery: {
      azul: serie("sweater", "azul", 3),
      cerezo: serie("sweater", "rosa", 3),
    },
  },
  {
    id: "pantalon", name: "Pantalón", cat: "pantalones", audience: "Clásico",
    price: 25000, colors: ["azulmarino", "celeste", "blanco", "rosa"], sizes: TALLES,
    stock: {
      rosa: ["RN-3 m", "3-6 m", "6-9 m", "9-12 m"],
      azulmarino: ["6-9 m"], celeste: ["6-9 m"], blanco: ["6-9 m"],
    },
    measures: [M_PANTALON],
    composition: "Hilo de algodón 8/3",
    badge: "Nuevo", fiber: "Algodón",
    short: "Pantalón con cordón y puños acanalados.", desc: TEXTO,
    cover: `${BASE}/pantalon/pantalon.jpg`,
    gallery: {
      azulmarino:    serie("pantalon", "azul", 2),
      celeste: serie("pantalon", "celeste", 2),
      blanco:  serie("pantalon", "blanco", 2),
      rosa:    serie("pantalon", "rosa", 2),
    },
  },
  {
    id: "cubrepanal-nube", name: "Cubrepañal Nube", cat: "cubrepanal", audience: "Clásico",
    price: 18000, colors: ["azulmarino", "celeste", "blanco", "rosa"], sizes: TALLES_CUBREPANAL,
    stock: { azulmarino: ["0-6 m"], celeste: ["0-6 m"], blanco: ["0-6 m"], rosa: ["0-6 m"] },
    measures: [M_CUBREPANAL],
    composition: "Hilo de algodón 8/3",
    badge: "Nuevo", fiber: "Algodón",
    short: "Cubrepañal con cordón y puntilla.", desc: TEXTO,
    cover: `${BASE}/cubrepanal/cubrepanal.jpg`,
    gallery: {
      azulmarino:    serie("cubrepanal", "azul", 2),
      celeste: serie("cubrepanal", "celeste", 2),
      blanco:  serie("cubrepanal", "blanco", 2),
      rosa:    serie("cubrepanal", "rosa", 2),
    },
  },
  {
    // Pantalón suelto (no es parte del conjunto arcoíris, que es remera + short)
    id: "pantalon-arcoiris", name: "Pantalón Arcoíris", cat: "pantalones", audience: "Colores",
    price: 25000, colors: ["multicolor"], sizes: TALLES,
    stock: { multicolor: ["6-9 m"] },
    measures: [M_PANTALON],
    composition: "Hilo de algodón 8/3",
    badge: "Nuevo", fiber: "Algodón",
    short: "Pantalón a rayas de colores.", desc: TEXTO,
    gallery: { default: serie("arcoiris", "arcoiris", 5) },
  },
  {
    // Body Frambuesa (musculosa): cereza liso y rayado cereza y blanco
    id: "body-frambuesa", name: "Body Frambuesa", cat: "bodys", audience: "Clásico",
    price: 30000, colors: ["1color", "2colores"], sizes: TALLES_BODY,
    stock: { "1color": ["3-6 m"], "2colores": ["3-6 m"] },
    measures: [M_BODY],
    composition: "Hilo de algodón 8/3",
    badge: "Nuevo", fiber: "Algodón",
    short: "Body sin mangas con broches.", desc: TEXTO,
    // Portada: los dos bodys juntos. Variantes: liso (1 color) y a rayas (2 colores)
    cover: [`${BASE}/body/body-1.jpg`, `${BASE}/body/body-7.jpg`],
    gallery: {
      "1color":   [5, 6].map((n) => `${BASE}/body/${n}-1color.jpg`),
      "2colores": [2, 3, 4].map((n) => `${BASE}/body/${n}-2colores.jpg`),
    },
  },
  {
    id: "enterito-hojitas", name: "Enterito Hojitas", cat: "enteritos", audience: "Clásico",
    price: 45000, colors: ["azulmarino", "crudo"], sizes: ["RN-3 m"],
    stock: { azulmarino: ["RN-3 m"], crudo: ["RN-3 m"] },
    measures: [M_ENTERITO],
    composition: "Hilo de algodón 8/6",
    badge: "Nuevo", fiber: "Algodón",
    short: "Enterito con calado en el pecho.", desc: TEXTO,
    gallery: {
      azulmarino: serie("body", "azul", 3),
      crudo:      serie("body", "crema", 3),
    },
  },
  // Conjuntos: cada uno es único, así que en vez de elegir talle se muestra el de cada pieza
  {
    id: "conjunto-combinado", name: "Conjunto Combinado", cat: "conjuntos", audience: "Clásico",
    price: 65000, colors: ["verdeclaro", "bosque"], sizes: TALLES,
    soldOut: ["bosque"],
    pieces: {
      verdeclaro: [{ name: "Remera", size: "9-12 m" }, { name: "Short", size: "9-12 m" }],
      bosque:     [{ name: "Remera", size: "9-12 m" }, { name: "Short", size: "9-12 m" }],
    },
    measures: [M_REMERA, M_SHORT],
    composition: "Hilo de algodón 8/3",
    badge: "Nuevo", fiber: "Algodón",
    short: "Remera a rayas con short liso.", desc: TEXTO,
    gallery: {
      verdeclaro: serie("conjunto", "conjunto-combinado", 5),
      bosque:     serie("conjunto", "conjunto-combinado-verde", 5),
    },
  },
  {
    id: "conjunto-diseno", name: "Conjunto Diseño", cat: "conjuntos", audience: "Clásico",
    price: 65000, colors: ["arcoiris", "marino", "rojo"], sizes: TALLES,
    soldOut: ["rojo"],
    pieces: {
      arcoiris: [{ name: "Remera", size: "9-12 m" }, { name: "Short", size: "9-12 m" }],
      rojo:     [{ name: "Remera", size: "6-9 m" }, { name: "Short", size: "6-9 m" }],
      marino:   [{ name: "Remera", size: "18-24 m" }, { name: "Short", size: "18-24 m" }],
    },
    measures: [M_REMERA, M_SHORT],
    composition: "Hilo de algodón 8/3",
    badge: "Nuevo", fiber: "Algodón",
    short: "Remera y short a rayas, haciendo juego.", desc: TEXTO,
    gallery: {
      arcoiris: serie("conjunto", "conjunto-diseno-arcoiris", 5),
      marino:   serie("conjunto", "conjunto-diseno-marino", 5),
      rojo:     serie("conjunto", "conjunto-diseno-rojo", 5),
    },
  },
  {
    // Vestido Florcitas: calado en los hombros
    id: "vestido-florcitas", name: "Vestido Florcitas", cat: "vestidos", audience: "Clásico",
    price: 65000, colors: ["botella", "crudo"], sizes: TALLES_VESTIDO,
    stock: { botella: ["6-12 m"], crudo: ["12-18 m"] },
    measures: [M_VESTIDO],
    composition: "Hilo de algodón 8/6",
    badge: "Nuevo", fiber: "Algodón",
    short: "Vestido con calado en los hombros y puntilla.", desc: TEXTO,
    gallery: {
      botella: serie("vestido", "vestidoVerde", 3),
      crudo:   serie("vestido", "vestidoCrudo", 3),
    },
  },
  {
    // Vestido Ámbar: otro modelo, canesú calado
    id: "vestido-ambar", name: "Vestido Ámbar", cat: "vestidos", audience: "Clásico",
    price: 85000, colors: ["lacre"], sizes: TALLES_VESTIDO,
    stock: { lacre: ["6-9 m"] },
    measures: [M_VESTIDO],
    composition: "Hilo de algodón 8/3",
    badge: "Nuevo", fiber: "Algodón",
    short: "Vestido con canesú calado.", desc: TEXTO,
    gallery: { lacre: serie("vestido", "vestidoLacreclaro", 3) },
  },

];
