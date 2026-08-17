export type ColorKey =
  | "arena"
  | "salvia"
  | "terracota"
  | "trigo"
  | "rosa"
  | "crudo"
  | "musgo";

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
  /** Producto fuera de venta por ahora (rebrand a solo niños) — se mantiene en los datos pero no aparece en catálogo/inicio. */
  hidden?: boolean;
};

export type CartItem = Product & {
  color: ColorKey;
  size: string;
  qty: number;
};

export type ImageTone = "blush" | "sage" | "caramel" | "rosa";
