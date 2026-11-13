import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { validateCartLine, priceOf } from "@/lib/data";
import { getFreshCatalog, variantKey, markSold, releaseSold } from "@/lib/catalog";
import { calculateShipping } from "@/lib/shipping";
import { sendBuyerOrderEmail, notifyAdminNewOrder, type OrderInfo } from "@/lib/notifications";
import { TRANSFER_DISCOUNT_RATE } from "@/lib/store-config";
import type { ColorKey } from "@/types";

interface CheckoutItemInput {
  id: string;
  color: ColorKey;
  size: string;
  qty: number;
}

interface CheckoutContact {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

interface TransferenciaRequestBody {
  items: CheckoutItemInput[];
  contact: CheckoutContact;
}

const REQUIRED_CONTACT_FIELDS: (keyof CheckoutContact)[] = [
  "name", "email", "phone", "street", "city", "province", "postalCode",
];

export async function POST(request: NextRequest) {
  let body: TransferenciaRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const { items, contact } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }
  if (!contact || REQUIRED_CONTACT_FIELDS.some((f) => !contact[f]?.trim())) {
    return NextResponse.json({ error: "Faltan datos de contacto o dirección." }, { status: 400 });
  }

  // Mismo criterio que /api/checkout: nunca confiamos en precios del cliente,
  // reconstruimos cada línea desde el catálogo real.
  const lines: { title: string; description: string; quantity: number; unit_price: number }[] = [];
  // La misma prenda no puede venir dos veces
  const seen = new Set(items.map((it: { id: string; color: string; size: string }) => `${it.id}|${it.color}|${it.size}`));
  if (seen.size !== items.length) {
    return NextResponse.json({ error: "Hay prendas repetidas en el carrito." }, { status: 400 });
  }
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
  const shipping = await calculateShipping(contact.postalCode, subtotal - discount);
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
