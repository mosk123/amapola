/**
 * Verificación de la firma (header x-signature) de las notificaciones de Mercado Pago. Solo servidor.
 *
 * MP firma con HMAC-SHA256 el texto `id:<data.id>;request-id:<x-request-id>;ts:<ts>;` usando la
 * "clave secreta" de Webhooks del panel (Tus integraciones → la app → Webhooks). Se guarda en
 * MP_WEBHOOK_SECRET. Los campos que no vienen se omiten del texto, como indica la documentación.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export type SignatureCheck = "valid" | "invalid" | "not-configured";

export function verifyMpSignature(headers: Headers, dataId: string | null): SignatureCheck {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return "not-configured";

  const header = headers.get("x-signature");
  if (!header) return "invalid";

  let ts: string | undefined;
  let v1: string | undefined;
  for (const part of header.split(",")) {
    const [k, ...rest] = part.split("=");
    const value = rest.join("=").trim();
    if (k.trim() === "ts") ts = value;
    else if (k.trim() === "v1") v1 = value;
  }
  if (!ts || !v1 || !/^[0-9a-f]+$/i.test(v1)) return "invalid";

  const requestId = headers.get("x-request-id");
  // Si el id es alfanumérico, MP lo firma en minúsculas
  const id = dataId ? (/^[a-z0-9]+$/i.test(dataId) ? dataId.toLowerCase() : dataId) : null;

  let manifest = "";
  if (id) manifest += `id:${id};`;
  if (requestId) manifest += `request-id:${requestId};`;
  manifest += `ts:${ts};`;

  const expected = createHmac("sha256", secret).update(manifest).digest();
  const given = Buffer.from(v1, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected) ? "valid" : "invalid";
}
