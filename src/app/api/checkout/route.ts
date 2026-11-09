import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getProductById, validateCartLine } from "@/lib/data";
import { calculateShipping } from "@/lib/shipping";
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

interface CheckoutRequestBody {
  items: CheckoutItemInput[];
  contact: CheckoutContact;
}

const REQUIRED_CONTACT_FIELDS: (keyof CheckoutContact)[] = [
  "name", "email", "phone", "street", "city", "province", "postalCode",
];

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
  let body: CheckoutRequestBody;
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

  // Nunca confiamos en precios/cantidades que manda el cliente: reconstruimos
  // cada línea a partir del catálogo real para que el total que se cobra sea el correcto.
  const lines: { id: string; title: string; description: string; quantity: number; unit_price: number }[] = [];
  // La misma prenda no puede venir dos veces
  const seen = new Set(items.map((it: { id: string; color: string; size: string }) => `${it.id}|${it.color}|${it.size}`));
  if (seen.size !== items.length) {
    return NextResponse.json({ error: "Hay prendas repetidas en el carrito." }, { status: 400 });
  }
  for (const item of items) {
    // Producto visible, color no agotado, talle con stock y 1 unidad (prendas únicas)
    const check = validateCartLine(item);
    if ("error" in check) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }
    const { product } = check;
    const qty = 1;
    lines.push({
      id: product.id,
      title: product.name,
      description: `${item.color} · talle ${item.size}`,
      quantity: qty,
      unit_price: product.price,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0);
  const shipping = await calculateShipping(contact.postalCode, subtotal);

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
      title: `Envío · ${shipping.label}`,
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
  };

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[checkout] Falta MP_ACCESS_TOKEN en las variables de entorno.");
    return NextResponse.json(
      { error: "El pago no está configurado todavía en el servidor." },
      { status: 500 }
    );
  }

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
        notification_url: `${origin}/api/webhook/mercadopago`,
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
