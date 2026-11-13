/**
 * Links firmados para que Amapola gestione un pedido por transferencia desde el mail
 * ("Pago recibido" / "Liberar prendas"). Solo servidor.
 *
 * La firma es un HMAC-SHA256 de "acción:orderId" con ORDER_ACTION_SECRET: sin esa clave
 * nadie puede armar un link válido para otro pedido u otra acción.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "./store-config";

export type OrderAction = "confirmar" | "liberar";
export const isOrderAction = (v: unknown): v is OrderAction => v === "confirmar" || v === "liberar";

// orderId = UUID generado por el servidor
const ORDER_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const isOrderId = (v: unknown): v is string => typeof v === "string" && ORDER_ID_RE.test(v);

function secret(): string | null {
  const s = process.env.ORDER_ACTION_SECRET;
  return s && s.length >= 32 ? s : null;
}

function sign(action: OrderAction, orderId: string, key: string): string {
  return createHmac("sha256", key).update(`${action}:${orderId}`).digest("hex");
}

/** ¿La firma corresponde a esta acción y este pedido? */
export function verifyOrderAction(action: unknown, orderId: unknown, token: unknown): boolean {
  const key = secret();
  if (!key || !isOrderAction(action) || !isOrderId(orderId) || typeof token !== "string") return false;
  const expected = Buffer.from(sign(action, orderId, key), "hex");
  const given = Buffer.from(token, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Link a la página de gestión (que pide confirmar antes de hacer nada), o null si falta la clave. */
export function orderActionUrl(action: OrderAction, orderId: string): string | null {
  const key = secret();
  if (!key) return null;
  const q = new URLSearchParams({ a: action, o: orderId, t: sign(action, orderId, key) });
  return `${SITE_URL}/pedido/gestionar?${q}`;
}
