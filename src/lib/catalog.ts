/**
 * Catálogo desde Supabase (solo servidor: no importar desde componentes "use client").
 *
 * - Lectura: con la publishable key (las políticas de la base solo permiten leer).
 * - Escritura (marcar prendas vendidas): con la secret key, solo desde el servidor.
 * - Sin SUPABASE_URL configurada, o con la base vacía, usa los productos del código (data.ts).
 */
import { cache } from "react";
import { PRODUCTS } from "./data";
import { cld } from "./cloudinary";
import type { ColorKey, MeasureTable, Product } from "@/types";
import { TRANSFER_RESERVATION_HOURS } from "./store-config";

const URL = process.env.SUPABASE_URL;
const READ_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const WRITE_KEY = process.env.SUPABASE_SECRET_KEY;

/** Cada cuántos segundos se refresca el catálogo que se muestra (las ventas lo refrescan al instante). */
const REVALIDATE_SECONDS = 60;

type Piece = { name: string; size: string };
type VariantRow = {
  id: string; color: string; size: string | null; pieces: Piece[] | null;
  price: number | null; status: "disponible" | "vendida";
};
type ImageRow = { color: string | null; path: string; position: number };
type ProductRow = {
  id: string; name: string; category: string; price: number; colors: string[]; sizes: string[];
  size_guides: string[]; composition: string | null; fiber: string; short_desc: string;
  description: string; badge: string | null; visible: boolean; position: number;
  product_variants: VariantRow[]; product_images: ImageRow[];
};
type GuideRow = { id: string; title: string; shape: "top" | "bottom"; rows: MeasureTable["rows"] };

/** Texto del talle de un conjunto, igual al que arma el carrito: "Remera 9-12 m · Short 9-12 m". */
export const piecesLabel = (pieces: Piece[]) => pieces.map((pc) => `${pc.name} ${pc.size}`).join(" · ");
/** Clave de una prenda dentro de un producto: color + talle (o talles del conjunto). */
export const variantKey = (color: string, size: string) => `${color}|${size}`;

async function get<T>(path: string, fresh: boolean): Promise<T> {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    headers: { apikey: READ_KEY! },
    ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: REVALIDATE_SECONDS, tags: ["catalog"] } }),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

function toProduct(r: ProductRow, guides: Map<string, GuideRow>): Product {
  const colors = r.colors as ColorKey[];
  const stock: NonNullable<Product["stock"]> = {};
  const pieces: NonNullable<Product["pieces"]> = {};
  const priceByColor: NonNullable<Product["priceByColor"]> = {};
  const soldOut: ColorKey[] = [];
  const variantIds: Record<string, string> = {};

  for (const color of colors) {
    const vs = r.product_variants.filter((v) => v.color === color);
    const available = vs.filter((v) => v.status === "disponible");
    // Todas las prendas de ese color vendidas → cartel "Agotado"
    if (vs.length > 0 && available.length === 0) soldOut.push(color);
    const price = vs.find((v) => v.price != null)?.price;
    if (price) priceByColor[color] = price;
    // Conjunto: talles de cada pieza (de la disponible, o de la vendida para mostrarlos igual)
    const set = (available[0] ?? vs[0])?.pieces;
    if (set) pieces[color] = set;
    stock[color] = r.sizes.filter((s) => available.some((v) => v.size === s));
    for (const v of available) {
      const size = v.pieces ? piecesLabel(v.pieces) : v.size;
      if (size) variantIds[variantKey(color, size)] = v.id;
    }
  }

  const imgs = [...r.product_images].sort((a, b) => a.position - b.position);
  const cover = imgs.filter((i) => i.color === null).map((i) => cld(i.path));
  const gallery: NonNullable<Product["gallery"]> = {};
  for (const i of imgs) {
    if (i.color === null) continue;
    const k = i.color as ColorKey | "default";
    (gallery[k] ??= []).push(cld(i.path));
  }

  return {
    id: r.id, name: r.name, cat: r.category, audience: "Clásico", price: r.price,
    colors, sizes: r.sizes, badge: r.badge ?? undefined, fiber: r.fiber,
    short: r.short_desc, desc: r.description, composition: r.composition ?? undefined,
    measures: r.size_guides.map((id) => guides.get(id)).filter((g): g is GuideRow => !!g)
      .map((g) => ({ title: g.title || undefined, shape: g.shape, rows: g.rows })),
    cover: cover.length ? cover : undefined,
    gallery, stock, priceByColor,
    pieces: Object.keys(pieces).length ? pieces : undefined,
    soldOut: soldOut.length ? soldOut : undefined,
    variantIds,
    hidden: !r.visible,
  };
}

async function load(fresh: boolean): Promise<Product[]> {
  if (!URL || !READ_KEY) return PRODUCTS;
  const [rows, guideRows] = await Promise.all([
    get<ProductRow[]>("products?select=*,product_variants(*),product_images(*)&order=position", fresh),
    get<GuideRow[]>("size_guides?select=*", fresh),
  ]);
  if (rows.length === 0) return PRODUCTS; // base todavía sin cargar (npm run db:seed)
  const guides = new Map(guideRows.map((g) => [g.id, g]));
  return rows.map((r) => toProduct(r, guides));
}

/** Catálogo para mostrar (cacheado unos segundos). Incluye ocultos: filtrar con `!p.hidden`. */
export const getCatalog = cache(() => load(false));

/** Catálogo recién leído de la base, para validar compras (nunca de caché). Antes libera reservas vencidas. */
export const getFreshCatalog = async () => {
  await releaseExpiredReservations().catch((err) => console.error("[reservas] No se pudieron liberar las vencidas:", err));
  return load(true);
};

export async function getCatalogProduct(id: string) {
  return (await getCatalog()).find((p) => p.id === id);
}

/**
 * Marca prendas como vendidas (solo las que seguían disponibles).
 * Devuelve cuántas se marcaron; con la base sin configurar no hace nada.
 */
export async function markSold(variantIds: string[], paymentRef: string): Promise<number> {
  if (!URL || !WRITE_KEY || variantIds.length === 0) return 0;
  const res = await fetch(
    `${URL}/rest/v1/product_variants?id=in.(${variantIds.join(",")})&status=eq.disponible`,
    {
      method: "PATCH",
      headers: { apikey: WRITE_KEY, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ status: "vendida", sold_at: new Date().toISOString(), payment_ref: paymentRef }),
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return ((await res.json()) as unknown[]).length;
}

/** ¿Ya se procesó este pago? (alguna prenda quedó marcada con esa referencia) */
export async function isPaymentProcessed(paymentRef: string): Promise<boolean> {
  if (!URL || !WRITE_KEY) return false;
  const res = await fetch(
    `${URL}/rest/v1/product_variants?select=id&payment_ref=eq.${encodeURIComponent(paymentRef)}&limit=1`,
    { headers: { apikey: WRITE_KEY }, cache: "no-store" },
  );
  if (!res.ok) return false;
  return ((await res.json()) as unknown[]).length > 0;
}

/** Vuelve a "disponible" las prendas marcadas con esa referencia (ej: pedido que no se pudo completar). */
export async function releaseSold(paymentRef: string): Promise<void> {
  if (!URL || !WRITE_KEY) return;
  await fetch(`${URL}/rest/v1/product_variants?payment_ref=eq.${encodeURIComponent(paymentRef)}`, {
    method: "PATCH",
    headers: { apikey: WRITE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ status: "disponible", sold_at: null, payment_ref: null }),
    cache: "no-store",
  });
}

/* ── Reservas de pedidos por transferencia ──
   Al hacer el pedido, las prendas quedan "vendida" con payment_ref = "transferencia:<orderId>".
   - Amapola confirma el pago  → payment_ref pasa a "transferencia-pagada:<orderId>" (venta firme).
   - Amapola libera / vencen    → vuelven a "disponible".
   Las no confirmadas vencen a las TRANSFER_RESERVATION_HOURS horas (sold_at = momento de la reserva). */

export const TRANSFER_PENDING = "transferencia:";
export const TRANSFER_PAID = "transferencia-pagada:";

/** Libera las reservas por transferencia sin confirmar que pasaron el plazo. Devuelve cuántas prendas liberó. */
export async function releaseExpiredReservations(): Promise<number> {
  if (!URL || !WRITE_KEY) return 0;
  const limit = new Date(Date.now() - TRANSFER_RESERVATION_HOURS * 3600_000).toISOString();
  const res = await fetch(
    `${URL}/rest/v1/product_variants?status=eq.vendida&payment_ref=like.${encodeURIComponent(TRANSFER_PENDING)}*&sold_at=lt.${encodeURIComponent(limit)}`,
    {
      method: "PATCH",
      headers: { apikey: WRITE_KEY, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ status: "disponible", sold_at: null, payment_ref: null }),
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const released = ((await res.json()) as unknown[]).length;
  if (released > 0) console.log(`[reservas] ${released} prenda(s) liberada(s) por vencimiento.`);
  return released;
}

export type ReservationItem = { name: string; color: string; size: string; status: string; paymentRef: string; soldAt: string | null };

/** Prendas de un pedido por transferencia (pendiente o confirmado), para la página de gestión. */
export async function getReservation(orderId: string): Promise<ReservationItem[]> {
  if (!URL || !WRITE_KEY) return [];
  const refs = [TRANSFER_PENDING + orderId, TRANSFER_PAID + orderId].map((r) => `"${r}"`).join(",");
  const res = await fetch(
    `${URL}/rest/v1/product_variants?select=color,size,pieces,status,payment_ref,sold_at,products(name)&payment_ref=in.(${encodeURIComponent(refs)})`,
    { headers: { apikey: WRITE_KEY }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const rows = (await res.json()) as {
    color: string; size: string | null; pieces: Piece[] | null; status: string;
    payment_ref: string; sold_at: string | null; products: { name: string } | null;
  }[];
  return rows.map((r) => ({
    name: r.products?.name ?? "Prenda",
    color: r.color,
    size: r.pieces ? piecesLabel(r.pieces) : r.size ?? "",
    status: r.status,
    paymentRef: r.payment_ref,
    soldAt: r.sold_at,
  }));
}

/** Confirma el pago de un pedido por transferencia: la reserva deja de vencer. Devuelve cuántas prendas confirmó. */
export async function confirmReservation(orderId: string): Promise<number> {
  if (!URL || !WRITE_KEY) return 0;
  const res = await fetch(
    `${URL}/rest/v1/product_variants?status=eq.vendida&payment_ref=eq.${encodeURIComponent(TRANSFER_PENDING + orderId)}`,
    {
      method: "PATCH",
      headers: { apikey: WRITE_KEY, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ payment_ref: TRANSFER_PAID + orderId }),
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return ((await res.json()) as unknown[]).length;
}
