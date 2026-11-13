// TEMPORAL: verifica qué IP ve el servidor detrás de Hostinger. Borrar después de la prueba.
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const h = request.headers;
  const ip = clientIp(request);
  const fwd = h.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const hash = (v: string) => createHash("sha256").update(v).digest("hex").slice(0, 16);
  return NextResponse.json({
    fuente: h.get("x-real-ip") ? "x-real-ip" : fwd.length ? "x-forwarded-for (último)" : "ninguna",
    entradasForwardedFor: fwd.length,
    hashIpDetectada: hash(ip),
    hashesForwardedFor: fwd.map(hash),
    hashRealIp: h.get("x-real-ip") ? hash(h.get("x-real-ip")!.trim()) : null,
    otrosHeaders: ["cf-connecting-ip", "true-client-ip", "x-client-ip", "forwarded"].filter((k) => h.has(k)),
    hashOtros: ["cf-connecting-ip", "true-client-ip", "x-client-ip"].filter((k) => h.has(k)).map((k) => [k, hash(h.get(k)!.trim())]),
  });
}
