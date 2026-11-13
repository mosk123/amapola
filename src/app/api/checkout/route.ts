import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { validateCartLine, priceOf } from "@/lib/data";
import { getFreshCatalog, variantKey } from "@/lib/catalog";
import { isShippingMethod, shippingFor } from "@/lib/shipping";
import { parseOrderInput, checkOrderRate } from "@/lib/checkout-guard";
import type { ColorKey } from "@/types";

/**
 * Origen público real del sitio. Detrás de un proxy/túnel (ngrok, y cualquier
 * hosting real) `request.url` no alcanza — Next arma la URL combinando su propio
 * host interno con el `x-forwarded-proto` del proxy, dando cosas rotas tipo
 * `https://localhost:3000`. Los headers `x-forwarded-*` sí traen el host público real.
 */
function resolveOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
    return `${forwardedProto}://${forwardedHost}`;
  }
  return new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  // Forma de los datos, tope de prendas por pedido y datos de contacto (texto, con largo máximo)
  const parsed = parseOrderInput(body);
  if ("error" in parsed) return parsed.error;
  const { items, contact, shippingMethod } = parsed;
  if (!isShippingMethod(shippingMethod)) {
    return NextResponse.json({ error: "Elegí cómo querés recibir el pedido." }, { status: 400 });
  }

  // Nunca confiamos en precios/cantidades que manda el cliente: reconstruimos
  // cada línea a partir del catálogo real para que el total que se cobra sea el correcto.
  const lines: { id: string; title: string; description: string; quantity: number; unit_price: number }[] = [];
  // Stock real, leído de la base en este momento (no de caché): una prenda única ya vendida no se puede volver a comprar
  let catalog;
  try {
    catalog = await getFreshCatalog();
  } catch (err) {
    console.error("[checkout] No se pudo leer el catálogo:", err);
    return NextResponse.json({ error: "No pudimos verificar el stock. Probá de nuevo en un momento." }, { status: 503 });
  }
  const variantIds: string[] = [];
  for (const item of items) {
    // Producto visible, color no agotado, talle con stock y 1 unidad (prendas únicas)
    const check = validateCartLine(item, catalog);
    if ("error" in check) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }
    const { product } = check;
    const variantId = product.variantIds?.[variantKey(item.color, item.size)];
    if (variantId) variantIds.push(variantId);
    // En producción cada prenda tiene que poder reservarse en la base: si no, el pedido saldría
    // sin bloquear stock (catálogo de respaldo porque la base falló o no está configurada).
    else if (process.env.NODE_ENV === "production") {
      console.error(`[checkout] ${product.id} (${item.color} / ${item.size}) sin variante en la base — se rechaza el pedido.`);
      return NextResponse.json({ error: "No pudimos verificar el stock. Probá de nuevo en un momento." }, { status: 503 });
    }
    const qty = 1;
    lines.push({
      id: product.id,
      title: product.name,
      description: `${item.color} · talle ${item.size}`,
      quantity: qty,
      unit_price: priceOf(product, item.color as ColorKey),
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0);
  const shipping = shippingFor(shippingMethod);

  const preferenceItems = lines.map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    quantity: l.quantity,
    currency_id: "ARS",
    unit_price: l.unit_price,
  }));

  if (shipping.cost > 0) {
    preferenceItems.push({
      id: "shipping",
      title: shipping.label,
      description: "",
      quantity: 1,
      currency_id: "ARS",
      unit_price: shipping.cost,
    });
  }

  const origin = resolveOrigin(request);

  // TODO: cuando exista persistencia de órdenes, crear acá el registro de la
  // orden (estado "pendiente") y usar su id real como external_reference,
  // en vez de un uuid descartable.
  const externalReference = crypto.randomUUID();

  // Sin base de datos todavía: guardamos el pedido completo en la metadata de la
  // preferencia (como un único string JSON — MP no soporta objetos anidados en
  // metadata de forma confiable) para que el webhook lo pueda leer al confirmarse el pago.
  const orderData = {
    orderId: externalReference,
    paymentMethod: "mercadopago" as const,
    contact,
    lines,
    subtotal,
    discount: 0,
    shipping,
    total: subtotal + shipping.cost,
    // Prendas a marcar vendidas cuando el webhook confirme el pago
    variantIds,
  };

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[checkout] Falta MP_ACCESS_TOKEN en las variables de entorno.");
    return NextResponse.json(
      { error: "El pago no está configurado todavía en el servidor." },
      { status: 500 }
    );
  }

  // Límite de pedidos por IP (se cuenta solo para pedidos válidos)
  const limited = checkOrderRate(request, "mercadopago");
  if (limited) return limited;

  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  try {
    const result = await preference.create({
      body: {
        items: preferenceItems,
        payer: {
          name: contact.name,
          email: contact.email,
          phone: { number: contact.phone },
        },
        external_reference: externalReference,
        metadata: { order_data: JSON.stringify(orderData) },
        back_urls: {
          success: `${origin}/checkout/exito`,
          failure: `${origin}/checkout/error`,
          pending: `${origin}/checkout/pendiente`,
        },
        // Mercado Pago exige que la success URL sea HTTPS para auto_return — en local (http)
        // lo omitimos; el usuario igual vuelve al sitio con el botón manual del checkout.
        ...(origin.startsWith("https://") ? { auto_return: "approved" as const } : {}),
        // source_news=webhooks: solo notificaciones nuevas (firmadas), no el IPN viejo sin firma
        notification_url: `${origin}/api/webhook/mercadopago?source_news=webhooks`,
      },
    });

    if (!result.init_point) {
      throw new Error("Mercado Pago no devolvió init_point.");
    }

    return NextResponse.json({ init_point: result.init_point });
  } catch (err) {
    console.error("[checkout] Error creando la preferencia de Mercado Pago:", err);
    return NextResponse.json(
      { error: "No pudimos iniciar el pago. Probá de nuevo en un momento." },
      { status: 502 }
    );
  }
}
