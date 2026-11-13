import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyOrderAction } from "@/lib/order-actions";
import { confirmReservation, releaseSold, TRANSFER_PENDING } from "@/lib/catalog";

/**
 * Ejecuta "Pago recibido" o "Liberar prendas" de un pedido por transferencia.
 * Solo por POST (el botón de la página /pedido/gestionar): abrir el link del mail
 * nunca cambia nada, así que los escáneres de links de los programas de mail no disparan acciones.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const a = form?.get("a");
  const o = form?.get("o");
  const t = form?.get("t");

  if (!verifyOrderAction(a, o, t)) {
    return NextResponse.json({ error: "Link inválido." }, { status: 403 });
  }
  const action = a as "confirmar" | "liberar";
  const orderId = o as string;

  let result: "confirmado" | "liberado" | "sin-cambios";
  try {
    if (action === "confirmar") {
      result = (await confirmReservation(orderId)) > 0 ? "confirmado" : "sin-cambios";
    } else {
      await releaseSold(TRANSFER_PENDING + orderId);
      result = "liberado";
      revalidatePath("/", "layout"); // las prendas vuelven a verse disponibles
    }
  } catch (err) {
    console.error(`[pedido] No se pudo ${action} el pedido ${orderId}:`, err);
    result = "sin-cambios";
  }
  console.log(`[pedido] ${action} ${orderId} → ${result}`);

  // Volver a la misma página con el resultado. Detrás del proxy de Hostinger, request.url trae el
  // host interno; el público viene en x-forwarded-host (solo afecta la redirección de quien hizo el POST).
  const host = request.headers.get("x-forwarded-host");
  const origin = host ? `${request.headers.get("x-forwarded-proto") ?? "https"}://${host}` : request.nextUrl.origin;
  const back = new URL("/pedido/gestionar", origin);
  back.search = new URLSearchParams({ a: action, o: orderId, t: String(t), r: result }).toString();
  return NextResponse.redirect(back, 303);
}
