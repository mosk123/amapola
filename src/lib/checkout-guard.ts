/**
 * Controles comunes de los dos checkouts (Mercado Pago y transferencia), solo servidor:
 * forma de los datos, tope de prendas por pedido y límite de pedidos por IP.
 */
import { NextResponse, type NextRequest } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { MAX_ITEMS_PER_ORDER } from "@/lib/store-config";

export interface CheckoutContact {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface CheckoutItemInput {
  id: string;
  color: string;
  size: string;
  qty: number;
}

const CONTACT_MAX: Record<keyof CheckoutContact, number> = {
  name: 100, email: 200, phone: 40, street: 200, city: 100, province: 100, postalCode: 20,
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

/**
 * Valida el cuerpo del pedido. Devuelve los datos limpios (solo los campos esperados,
 * como texto y recortados) o la respuesta de error lista para devolver.
 */
export function parseOrderInput(body: unknown):
  | { items: CheckoutItemInput[]; contact: CheckoutContact; shippingMethod: unknown }
  | { error: NextResponse } {
  const b = (body ?? {}) as { items?: unknown; contact?: unknown; shippingMethod?: unknown };

  if (!Array.isArray(b.items) || b.items.length === 0) return { error: bad("El carrito está vacío.") };
  if (b.items.length > MAX_ITEMS_PER_ORDER) {
    return { error: bad(`Podés comprar hasta ${MAX_ITEMS_PER_ORDER} prendas por pedido. Si querés más, escribinos por WhatsApp.`) };
  }
  const items: CheckoutItemInput[] = [];
  for (const raw of b.items) {
    const it = (raw ?? {}) as Record<string, unknown>;
    if (typeof it.id !== "string" || typeof it.color !== "string" || typeof it.size !== "string" || typeof it.qty !== "number") {
      return { error: bad("Hay una prenda inválida en el carrito.") };
    }
    items.push({ id: it.id, color: it.color, size: it.size, qty: it.qty });
  }
  if (new Set(items.map((it) => `${it.id}|${it.color}|${it.size}`)).size !== items.length) {
    return { error: bad("Hay prendas repetidas en el carrito.") };
  }

  const c = (b.contact ?? {}) as Record<string, unknown>;
  const contact = {} as CheckoutContact;
  for (const field of Object.keys(CONTACT_MAX) as (keyof CheckoutContact)[]) {
    const v = typeof c[field] === "string" ? (c[field] as string).trim() : "";
    if (!v) return { error: bad("Faltan datos de contacto o dirección.") };
    if (v.length > CONTACT_MAX[field]) return { error: bad("Algún dato de contacto es demasiado largo.") };
    contact[field] = v;
  }
  if (!EMAIL_RE.test(contact.email)) return { error: bad("El email no parece válido.") };

  return { items, contact, shippingMethod: b.shippingMethod };
}

/**
 * Límite de pedidos por IP (y uno general, por si llegan desde muchas IPs).
 * Devuelve la respuesta 429 si se pasó, o null si puede seguir.
 */
export function checkOrderRate(
  request: NextRequest,
  kind: "transferencia" | "mercadopago",
): NextResponse | null {
  const LIMITS = {
    // Transferencia reserva prendas: límite estricto
    transferencia: { perIp: [3, 60 * 60_000], global: [20, 60 * 60_000] },
    // Mercado Pago no reserva nada hasta que se paga: más holgado
    mercadopago: { perIp: [10, 10 * 60_000], global: [120, 10 * 60_000] },
  } as const;
  const { perIp, global } = LIMITS[kind];

  const ip = rateLimit(`${kind}:ip:${clientIp(request)}`, perIp[0], perIp[1]);
  const all = ip.ok ? rateLimit(`${kind}:all`, global[0], global[1]) : ip;
  if (ip.ok && all.ok) return null;

  const wait = Math.max(ip.retryAfter, all.retryAfter);
  console.warn(`[checkout] Límite de pedidos (${kind}) alcanzado — reintentar en ${wait}s.`);
  return NextResponse.json(
    { error: "Recibimos demasiados pedidos seguidos. Esperá un rato o escribinos por WhatsApp." },
    { status: 429, headers: { "Retry-After": String(wait) } },
  );
}
