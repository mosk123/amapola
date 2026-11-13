export type ColorKey =
  | "arena"
  | "salvia"
  | "terracota"
  | "trigo"
  | "rosa"
  | "crudo"
  | "musgo"
  | "azul"
  | "celeste"
  | "blanco"
  | "verde"
  | "violeta"
  | "multicolor"
  | "1color"
  | "2colores"
  | "crema"
  | "verdeclaro"
  | "bosque"
  | "arcoiris"
  | "marino"
  | "rojo"
  | "cerezo"
  | "lacre"
  | "botella"
  | "azulmarino";

export type ColorInfo = {
  label: string;
  hex: string;
};

export type Category = {
  id: string;
  label: string;
  blurb: string;
};

export type Product = {
  id: string;
  name: string;
  cat: string;
  audience: string;
  price: number;
  colors: ColorKey[];
  sizes: string[];
  badge?: string;
  fiber: string;
  short: string;
  desc: string;
  image?: string;
  /**
   * Foto(s) de portada (ej: todos los colores juntos). La card muestra la primera; el detalle
   * las muestra hasta que se elige un color, y ahí pasa a las fotos de ese color.
   */
  cover?: string | string[];
  /**
   * Fotos por color, en orden. Al elegir un color se muestran las suyas.
   * "default" se usa para productos sin variantes o colores sin fotos propias.
   * Si no hay gallery, se usa `image`.
   */
  gallery?: Partial<Record<ColorKey | "default", string[]>>;
  /**
   * Talles que hay por color (cada prenda es única). Los que no figuran se muestran en gris.
   * Sin `stock` = todos los talles disponibles. Un color sin entrada = sin stock.
   */
  stock?: Partial<Record<ColorKey | "default", string[]>>;
  /**
   * Conjuntos: talle de cada pieza por color (ej: remera 6-9 m + short 6-9 m).
   * Si el color tiene piezas, el detalle las muestra en lugar del selector de talle.
   */
  pieces?: Partial<Record<ColorKey, { name: string; size: string }[]>>;
  /** Precio distinto para algunos colores (el resto usa `price`). */
  priceByColor?: Partial<Record<ColorKey, number>>;
  /** Colores ya vendidos: se siguen viendo, con cartel "Agotado", pero no se pueden comprar. */
  soldOut?: ColorKey[];
  /** Composición (grosor del hilo), ej: "Hilo de algodón 8/3". Se muestra en la descripción. */
  composition?: string;
  /** Guía de talles (una tabla por pieza; los conjuntos tienen remera y short). */
  measures?: MeasureTable[];
  /** Base de datos: id de cada prenda disponible, por "color|talle" (para marcarla vendida al pagarse). */
  variantIds?: Record<string, string>;
  /** Producto fuera de venta por ahora (rebrand a solo niños) — se mantiene en los datos pero no aparece en catálogo/inicio. */
  hidden?: boolean;
};

/** Una fila de la guía de talles (medidas en cm). */
export type MeasureRow = {
  size: string;
  largo?: number | string;
  ancho?: number | string;
  sisa?: number | string;
  manga?: number | string;
};

/** Tabla de la guía de talles. `shape` elige el dibujo: prenda de arriba o de abajo. */
export type MeasureTable = {
  title?: string;
  shape: "top" | "bottom";
  rows: MeasureRow[];
};

export type CartItem = Product & {
  color: ColorKey;
  size: string;
  qty: number;
};

export type ImageTone = "blush" | "sage" | "caramel" | "rosa";
