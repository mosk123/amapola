import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/data";
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
  for (const item of items) {
    const product = getProductById(item.id);
    const qty = Math.floor(item.qty);
    if (!product || !Number.isFinite(qty) || qty < 1) {
      return NextResponse.json({ error: `Producto inválido: ${item.id}` }, { status: 400 });
    }
    lines.push({
      title: product.name,
      description: `${item.color} · talle ${item.size}`,
      quantity: qty,
      unit_price: product.price,
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

  await Promise.all([sendBuyerOrderEmail(order), notifyAdminNewOrder(order)]);

  return NextResponse.json({ orderId, total });
}
