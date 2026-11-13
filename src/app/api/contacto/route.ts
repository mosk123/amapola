import { NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/notifications";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { nombre: 100, email: 200, mensaje: 3000 };

// Límite de consultas: por persona (IP) y en total, para no llenar la casilla ni gastar la cuota de Resend
const PER_IP = { limit: 3, windowMs: 10 * 60_000 };
const GLOBAL = { limit: 30, windowMs: 60 * 60_000 };

/** Formulario de Contacto: valida y manda la consulta por mail (Resend) a ADMIN_EMAIL. */
export async function POST(req: Request) {
  let body: { nombre?: unknown; email?: unknown; mensaje?: unknown; empresa?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  // Campo trampa invisible: si viene lleno es un bot. Respondemos ok sin mandar nada.
  if (typeof body.empresa === "string" && body.empresa.trim()) {
    return NextResponse.json({ ok: true });
  }

  const nombre = typeof body.nombre === "string" ? body.nombre.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const mensaje = typeof body.mensaje === "string" ? body.mensaje.trim() : "";

  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ error: "Completá nombre, email y mensaje." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "El email no parece válido." }, { status: 400 });
  }
  if (nombre.length > MAX.nombre || email.length > MAX.email || mensaje.length > MAX.mensaje) {
    return NextResponse.json({ error: "El mensaje es demasiado largo." }, { status: 400 });
  }

  // Se cuenta recién acá, con la consulta ya validada
  const ip = rateLimit(`contacto:ip:${clientIp(req)}`, PER_IP.limit, PER_IP.windowMs);
  const all = ip.ok ? rateLimit("contacto:all", GLOBAL.limit, GLOBAL.windowMs) : ip;
  if (!ip.ok || !all.ok) {
    console.warn("[contacto] Límite de consultas alcanzado.");
    return NextResponse.json(
      { error: "Recibimos varios mensajes seguidos. Esperá unos minutos o escribinos por WhatsApp." },
      { status: 429, headers: { "Retry-After": String(Math.max(ip.retryAfter, all.retryAfter)) } },
    );
  }

  const ok = await sendContactMessage({ nombre, email, mensaje });
  if (!ok) {
    return NextResponse.json(
      { error: "No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
