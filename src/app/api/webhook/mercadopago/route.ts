import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { sendBuyerOrderEmail, notifyAdminNewOrder, type OrderInfo } from "@/lib/notifications";

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

      let order: OrderInfo;
      try {
        order = JSON.parse(rawOrderData) as OrderInfo;
      } catch (err) {
        console.error(`[webhook] metadata.order_data del pago ${paymentId} no es JSON válido:`, err);
        break;
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
