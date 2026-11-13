import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { revalidatePath } from "next/cache";
import { sendBuyerOrderEmail, notifyAdminNewOrder, type OrderInfo } from "@/lib/notifications";
import { markSold, isPaymentProcessed } from "@/lib/catalog";
import { verifyMpSignature } from "@/lib/mp-signature";

interface WebhookBody {
  type?: string;
  data?: { id?: string };
}

/**
 * Sin base de datos todavía, esto es lo único que evita mandar el mismo mail/WhatsApp
 * dos veces si Mercado Pago reintenta la notificación (algo que hace seguido).
 * No sobrevive un reinicio ni funciona con más de una instancia — cuando haya
 * persistencia de órdenes, reemplazar por una columna "notified_at" en la orden.
 */
const notifiedPaymentIds = new Set<string>();

export async function POST(request: NextRequest) {
  let body: WebhookBody = {};
  try {
    body = await request.json();
  } catch {
    // Body vacío/no-JSON: no hay nada que procesar, pero confirmamos recepción
    // para que Mercado Pago no reintente algo que nunca va a poder leer.
    return NextResponse.json({ received: true });
  }

  // Además del formato "webhooks" nuevo (JSON body), Mercado Pago a veces manda
  // el IPN viejo por query string (?type=payment&data.id=123) — cubrimos los dos.
  const params = request.nextUrl.searchParams;
  const type = body.type ?? params.get("type") ?? params.get("topic");
  const paymentId = body.data?.id ?? params.get("data.id") ?? params.get("id");

  // Solo nos interesan notificaciones de pago — el resto (merchant_order, etc.) se ignora.
  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ received: true });
  }

  // Los ids de pago de MP son numéricos: cualquier otra cosa no se consulta.
  if (!/^\d{1,20}$/.test(String(paymentId))) {
    console.warn(`[webhook] Id de pago con formato inválido — se ignora.`);
    return NextResponse.json({ received: true });
  }

  // Firma de Mercado Pago: si la clave está configurada, se rechaza todo lo que no venga firmado por MP.
  const signature = verifyMpSignature(request.headers, params.get("data.id") ?? String(paymentId));
  if (signature === "invalid") {
    console.warn(`[webhook] Notificación del pago ${paymentId} con firma inválida — rechazada.`);
    return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
  }
  if (signature === "not-configured") {
    console.warn("[webhook] Falta MP_WEBHOOK_SECRET: no se verifica la firma (el pago igual se consulta en Mercado Pago).");
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[webhook] Falta MP_ACCESS_TOKEN en las variables de entorno.");
    return NextResponse.json({ error: "No configurado." }, { status: 500 });
  }

  // Nunca confiamos en el estado que pueda venir en el payload de la notificación:
  // volvemos a consultar el pago real contra la API de Mercado Pago antes de actuar.
  const client = new MercadoPagoConfig({ accessToken });
  let payment;
  try {
    payment = await new Payment(client).get({ id: paymentId });
  } catch (err) {
    console.error(`[webhook] No se pudo consultar el pago ${paymentId} en Mercado Pago:`, err);
    // 5xx a propósito: esto puede ser un problema transitorio (red, rate limit) —
    // dejamos que Mercado Pago reintente la notificación más tarde.
    return NextResponse.json({ error: "No se pudo verificar el pago." }, { status: 502 });
  }

  const status = payment.status;
  const externalReference = payment.external_reference;

  // TODO: cuando exista persistencia de órdenes, buscar la orden por
  // `externalReference` acá y actualizar su estado (en vez de solo loggear).
  switch (status) {
    case "approved": {
      console.log(`[webhook] Pago ${paymentId} APROBADO — orden ${externalReference}`);

      if (notifiedPaymentIds.has(String(paymentId))) {
        console.log(`[webhook] Pago ${paymentId} ya había disparado notificaciones — se ignora el reintento.`);
        break;
      }

      const rawOrderData = (payment.metadata as Record<string, unknown> | undefined)?.order_data;
      if (typeof rawOrderData !== "string") {
        console.error(`[webhook] El pago ${paymentId} no trae metadata.order_data — no se puede armar el pedido para notificar.`);
        break;
      }

      let order: OrderInfo & { variantIds?: string[] };
      try {
        order = JSON.parse(rawOrderData) as OrderInfo & { variantIds?: string[] };
      } catch (err) {
        console.error(`[webhook] metadata.order_data del pago ${paymentId} no es JSON válido:`, err);
        break;
      }

      // Prendas únicas: marcarlas vendidas en la base. La referencia del pago evita procesarlo dos veces.
      const paymentRef = `mp:${paymentId}`;
      const variantIds = Array.isArray(order.variantIds) ? order.variantIds : [];
      if (variantIds.length > 0) {
        try {
          if (await isPaymentProcessed(paymentRef)) {
            console.log(`[webhook] Pago ${paymentId} ya procesado en la base — se ignora el reintento.`);
            break;
          }
          const marked = await markSold(variantIds, paymentRef);
          if (marked < variantIds.length) {
            console.warn(`[webhook] Pago ${paymentId}: ${variantIds.length - marked} prenda(s) ya figuraban vendidas — revisar posible doble venta.`);
          }
          revalidatePath("/", "layout"); // el catálogo muestra "Agotado" al instante
        } catch (err) {
          console.error(`[webhook] No se pudo marcar vendido el pago ${paymentId}:`, err);
          // 5xx: Mercado Pago reintenta y volvemos a intentar marcarlo
          return NextResponse.json({ error: "No se pudo actualizar el stock." }, { status: 502 });
        }
      }

      notifiedPaymentIds.add(String(paymentId));
      await Promise.all([sendBuyerOrderEmail(order), notifyAdminNewOrder(order)]);
      break;
    }
    case "rejected":
      console.log(`[webhook] Pago ${paymentId} RECHAZADO — orden ${externalReference}`);
      break;
    case "pending":
      console.log(`[webhook] Pago ${paymentId} PENDIENTE — orden ${externalReference}`);
      break;
    case "cancelled":
      console.log(`[webhook] Pago ${paymentId} CANCELADO — orden ${externalReference}`);
      break;
    default:
      console.warn(`[webhook] Pago ${paymentId} con estado no reconocido: ${status} — orden ${externalReference}`);
  }

  return NextResponse.json({ received: true });
}
