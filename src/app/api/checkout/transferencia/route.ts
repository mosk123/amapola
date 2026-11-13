import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { validateCartLine, priceOf } from "@/lib/data";
import { getFreshCatalog, variantKey, markSold, releaseSold } from "@/lib/catalog";
import { isShippingMethod, isShippingAvailable, shippingFor, type ShippingMethod } from "@/lib/shipping";
import { sendBuyerOrderEmail, notifyAdminNewOrder, type OrderInfo } from "@/lib/notifications";
import { TRANSFER_DISCOUNT_RATE } from "@/lib/store-config";
import { parseOrderInput, checkOrderRate } from "@/lib/checkout-guard";
import type { ColorKey } from "@/types";


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
  if (!isShippingMethod(shippingMethod) || !isShippingAvailable(shippingMethod, contact.postalCode)) {
    return NextResponse.json({ error: "Elegí cómo querés recibir el pedido." }, { status: 400 });
  }

  // Mismo criterio que /api/checkout: nunca confiamos en precios del cliente,
  // reconstruimos cada línea desde el catálogo real.
  const lines: { title: string; description: string; quantity: number; unit_price: number }[] = [];
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
      title: product.name,
      description: `${item.color} · talle ${item.size}`,
      quantity: qty,
      unit_price: priceOf(product, item.color as ColorKey),
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0);
  const discount = Math.round(subtotal * TRANSFER_DISCOUNT_RATE);
  const shipping = shippingFor(shippingMethod);
  const total = subtotal - discount + shipping.cost;

  // TODO: cuando exista persistencia de órdenes, crear acá el registro
  // (estado "pendiente de comprobante") en vez de solo notificar y olvidar.
  const orderId = crypto.randomUUID();

  const order: OrderInfo = {
    orderId,
    paymentMethod: "transferencia",
    contact,
    lines,
    subtotal,
    discount,
    shipping,
    total,
  };

  // Límite de pedidos por IP: se cuenta recién acá, cuando el pedido es válido y va a reservar stock
  const limited = checkOrderRate(request, "transferencia");
  if (limited) return limited;

  // Prenda única: queda reservada (vendida) apenas se hace el pedido, para que nadie más la compre
  // mientras llega la transferencia. Si no se paga, se vuelve a "disponible" desde Supabase.
  try {
    const marked = await markSold(variantIds, `transferencia:${orderId}`);
    if (marked < variantIds.length) {
      await releaseSold(`transferencia:${orderId}`);
      return NextResponse.json({ error: "Alguna prenda se acaba de vender. Revisá tu carrito." }, { status: 409 });
    }
    if (marked > 0) revalidatePath("/", "layout"); // se ven "Agotado" al instante
  } catch (err) {
    console.error("[transferencia] No se pudo reservar el stock:", err);
    return NextResponse.json({ error: "No pudimos reservar las prendas. Probá de nuevo en un momento." }, { status: 503 });
  }

  await Promise.all([sendBuyerOrderEmail(order), notifyAdminNewOrder(order)]);

  return NextResponse.json({ orderId, total });
}
