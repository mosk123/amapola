/**
 * Límite de pedidos en memoria (ventana deslizante), solo servidor.
 *
 * Alcanza para un sitio con una sola instancia de Node (Hostinger): si el proceso
 * se reinicia, los contadores arrancan de cero, lo cual es aceptable para frenar
 * abuso automatizado. Si algún día hay varias instancias, mover a una base compartida.
 */
const buckets = new Map<string, number[]>();
const MAX_KEYS = 10_000; // tope de memoria: si se llena, se descartan las claves más viejas

/**
 * Registra un intento para `key` y dice si está dentro del límite.
 * `retryAfter` = segundos hasta que se libere un lugar.
 */
export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.delete(key); // reinsertar = queda como la más reciente
  buckets.set(key, hits);
  if (buckets.size > MAX_KEYS) {
    const oldest = buckets.keys().next().value;
    if (oldest !== undefined) buckets.delete(oldest);
  }
  return { ok: true, retryAfter: 0 };
}

/**
 * IP del cliente detrás del proxy de Hostinger. Se toma el ÚLTIMO valor de
 * x-forwarded-for (lo agrega el proxy); el primero lo puede inventar el cliente.
 */
export function clientIp(request: { headers: Headers }): string {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const fwd = request.headers.get("x-forwarded-for");
  const last = fwd?.split(",").map((s) => s.trim()).filter(Boolean).pop();
  return last || "unknown";
}
