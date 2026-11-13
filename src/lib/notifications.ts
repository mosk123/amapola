import { Resend } from "resend";
import Twilio from "twilio";
import { fmt } from "@/lib/data";
import { TRANSFER_ALIAS, ADMIN_WHATSAPP_DISPLAY, TRANSFER_RESERVATION_HOURS } from "@/lib/store-config";
import { orderActionUrl } from "@/lib/order-actions";

// Wordmark en texto, no imagen: Gmail no soporta de forma confiable imágenes
// `data:` (base64) incrustadas en el mail, y una URL hosteada depende de que el
// sitio esté online y sea público en ese momento — texto no tiene ninguno de los dos problemas.
function logoHeaderHtml(): string {
  return `<span style="font:700 22px/1 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#FFFFFF;letter-spacing:.02em;">Amapola <span style="font-weight:400;opacity:.85;">Knitwear</span></span>`;
}

export interface OrderLine {
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface OrderContact {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface OrderInfo {
  orderId: string;
  paymentMethod: "mercadopago" | "transferencia";
  contact: OrderContact;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: { cost: number; label: string };
  total: number;
}

const BRAND = {
  plum: "#41284B",
  coral: "#E27A6A",
  mustard: "#DBAA6B",
  // Tinte literal (no color-mix: los clientes de mail no lo soportan).
  coralTint: "#FBEDEA",
  cream: "#FBF8F1",
  line: "#EBDFD4",
  ink: "#3B302A",
  inkSoft: "#6E5F54",
};

function itemsRowsHtml(lines: OrderLine[]): string {
  return lines
    .map(
      (l) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BRAND.line};font:400 14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
          <strong>${escapeHtml(l.title)}</strong><br/>
          <span style="color:${BRAND.inkSoft};font-size:12px;">${escapeHtml(l.description)} · × ${l.quantity}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid ${BRAND.line};font:600 14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};text-align:right;white-space:nowrap;">
          ${fmt(l.unit_price * l.quantity)}
        </td>
      </tr>`
    )
    .join("");
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function totalsRowsHtml(order: OrderInfo): string {
  const rows: [string, string, boolean?][] = [["Subtotal", fmt(order.subtotal)]];
  if (order.discount > 0) {
    rows.push(["Descuento transferencia (10%)", `-${fmt(order.discount)}`]);
  }
  rows.push([order.shipping.label || "Envío", order.shipping.cost === 0 ? "Gratis" : fmt(order.shipping.cost)]);
  rows.push(["Total", fmt(order.total), true]);

  return rows
    .map(
      ([label, value, big]) => `
      <tr>
        <td style="padding:${big ? "10px" : "4px"} 0;font:${big ? "700 16px" : "400 13px"}/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">${label}</td>
        <td style="padding:${big ? "10px" : "4px"} 0;font:700 ${big ? "16px" : "13px"}/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};text-align:right;">${value}</td>
      </tr>`
    )
    .join("");
}

function buildBuyerEmailHtml(order: OrderInfo): string {
  const { contact } = order;
  const transferBlock =
    order.paymentMethod === "transferencia"
      ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:${BRAND.coralTint};border:1px solid ${BRAND.coral};border-radius:12px;">
        <tr><td style="padding:18px 20px;">
          <p style="margin:0 0 10px;font:700 14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">Datos para transferir</p>
          <p style="margin:0 0 6px;font:400 14px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">Alias: <strong>${escapeHtml(TRANSFER_ALIAS)}</strong></p>
          <p style="margin:0;font:400 14px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
            Una vez que hagas la transferencia, enviá el comprobante de pago por WhatsApp al
            <strong>${escapeHtml(ADMIN_WHATSAPP_DISPLAY)}</strong>. Apenas lo recibamos, confirmamos tu pedido y coordinamos el envío.
          </p>
          <p style="margin:10px 0 0;font:400 13px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.inkSoft};">
            Te reservamos las prendas por ${TRANSFER_RESERVATION_HOURS} horas. Si no recibimos la transferencia en ese plazo, vuelven a estar disponibles en la tienda.
          </p>
        </td></tr>
      </table>`
      : `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:${BRAND.coralTint};border:1px solid ${BRAND.coral};border-radius:12px;">
        <tr><td style="padding:18px 20px;">
          <p style="margin:0;font:400 14px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
            Ya recibimos tu pago — ¡gracias! Estamos preparando tu pedido para el envío.
          </p>
        </td></tr>
      </table>`;

  return `
  <div style="background:${BRAND.cream};padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
      <tr><td style="background:${BRAND.plum};border-radius:16px 16px 0 0;padding:24px 28px;text-align:center;">
        ${logoHeaderHtml()}
      </td></tr>
      <tr><td style="background:#FFFFFF;border-radius:0 0 16px 16px;padding:28px;">
        <p style="margin:0 0 4px;font:700 20px/1.3 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
          ¡Gracias por tu pedido, ${escapeHtml(contact.name)}!
        </p>
        <p style="margin:0 0 20px;font:400 13px/1.4 'IBM Plex Mono',monospace;color:${BRAND.inkSoft};">
          Pedido #${order.orderId}
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemsRowsHtml(order.lines)}</table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;border-top:1px solid ${BRAND.line};padding-top:6px;">${totalsRowsHtml(order)}</table>

        ${transferBlock}

        <p style="margin:24px 0 6px;font:700 13px/1 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">Dirección de envío</p>
        <p style="margin:0;font:400 14px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.inkSoft};">
          ${escapeHtml(contact.street)}<br/>
          ${escapeHtml(contact.city)}, ${escapeHtml(contact.province)} (${escapeHtml(contact.postalCode)})
        </p>

        <p style="margin:28px 0 0;font:400 12px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.inkSoft};text-align:center;">
          Tejidos artesanales · Amapola Knitwear
        </p>
      </td></tr>
    </table>
  </div>`;
}

/** Botones "Pago recibido" / "Liberar prendas" del mail al vendedor (transferencia). */
function adminActionButtons(orderId: string): string {
  const confirm = orderActionUrl("confirmar", orderId);
  const release = orderActionUrl("liberar", orderId);
  if (!confirm || !release) {
    console.error("[notifications] Falta ORDER_ACTION_SECRET — el mail al vendedor sale sin botones para confirmar/liberar.");
    return "";
  }
  const btn = (href: string, label: string, bg: string) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;margin:12px 8px 0 0;padding:12px 18px;border-radius:999px;background:${bg};color:#FFFFFF;text-decoration:none;font:700 14px/1 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${label}</a>`;
  return btn(confirm, "✅ Pago recibido", BRAND.coral) + btn(release, "Liberar prendas", BRAND.plum);
}

function buildAdminEmailHtml(order: OrderInfo): string {
  const { contact } = order;
  const isTransfer = order.paymentMethod === "transferencia";
  const statusColor = isTransfer ? BRAND.mustard : BRAND.coral;
  const statusText = isTransfer ? "🧾 Pendiente de comprobante" : "✅ Pago acreditado por Mercado Pago";

  const infoRow = (label: string, value: string) => `
    <tr>
      <td style="padding:5px 0;font:600 12px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.inkSoft};width:110px;vertical-align:top;">${label}</td>
      <td style="padding:5px 0;font:400 14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">${value}</td>
    </tr>`;

  return `
  <div style="background:${BRAND.cream};padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
      <tr><td style="background:${BRAND.plum};border-radius:16px 16px 0 0;padding:24px 28px;text-align:center;">
        ${logoHeaderHtml()}
      </td></tr>
      <tr><td style="background:#FFFFFF;border-radius:0 0 16px 16px;padding:28px;">
        <span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${statusColor};color:#FFFFFF;font:700 12px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
          ${statusText}
        </span>
        <p style="margin:14px 0 4px;font:700 20px/1.3 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
          Pedido nuevo — ${fmt(order.total)}
        </p>
        <p style="margin:0 0 20px;font:400 13px/1.4 'IBM Plex Mono',monospace;color:${BRAND.inkSoft};">
          Pedido #${order.orderId}
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          ${infoRow("Comprador", escapeHtml(contact.name))}
          ${infoRow("Email", `<a href="mailto:${escapeHtml(contact.email)}" style="color:${BRAND.ink};">${escapeHtml(contact.email)}</a>`)}
          ${infoRow("Teléfono", `<a href="tel:${escapeHtml(contact.phone)}" style="color:${BRAND.ink};">${escapeHtml(contact.phone)}</a>`)}
          ${infoRow("Dirección", `${escapeHtml(contact.street)}, ${escapeHtml(contact.city)}, ${escapeHtml(contact.province)} (${escapeHtml(contact.postalCode)})`)}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemsRowsHtml(order.lines)}</table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;border-top:1px solid ${BRAND.line};padding-top:6px;">${totalsRowsHtml(order)}</table>

        ${isTransfer
          ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:${BRAND.coralTint};border:1px solid ${BRAND.coral};border-radius:12px;">
              <tr><td style="padding:16px 18px;">
                <p style="margin:0;font:400 13px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
                  Esperá el comprobante por WhatsApp antes de confirmar el pedido y coordinar el envío.
                  Las prendas quedan reservadas ${TRANSFER_RESERVATION_HOURS} horas: si no confirmás el pago, vuelven solas a la tienda.
                </p>
                ${adminActionButtons(order.orderId)}
              </td></tr>
            </table>`
          : ""}
      </td></tr>
    </table>
  </div>`;
}

// Sin dominio propio verificado en Resend, este es el único remitente que funciona
// (y solo entrega a la casilla dueña de la cuenta de Resend) — sirve para probar.
// Con dominio verificado, poner RESEND_FROM_EMAIL con un remitente propio.
function resendFrom(): string {
  return process.env.RESEND_FROM_EMAIL || "Amapola Knitwear <onboarding@resend.dev>";
}

function adminWhatsappBody(order: OrderInfo): string {
  const { contact } = order;
  const itemsList = order.lines.map((l) => `• ${l.title} (${l.description}) × ${l.quantity}`).join("\n");
  const heading =
    order.paymentMethod === "transferencia"
      ? "🧾 Nuevo pedido por TRANSFERENCIA (pendiente de comprobante)"
      : "✅ Nuevo pedido — Mercado Pago aprobado";

  return `${heading}
Pedido #${order.orderId}
Total: ${fmt(order.total)}

Comprador: ${contact.name}
Email: ${contact.email}
Tel: ${contact.phone}
Dirección: ${contact.street}, ${contact.city}, ${contact.province} (${contact.postalCode})

${itemsList}`;
}

/** Envía el mail de confirmación al comprador. No lanza — si falla, solo loguea (no debe romper el checkout/webhook). */
export async function sendBuyerOrderEmail(order: OrderInfo): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[notifications] Falta RESEND_API_KEY — no se pudo enviar el mail al comprador.");
    return;
  }
  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: resendFrom(),
      to: order.contact.email,
      subject:
        order.paymentMethod === "transferencia"
          ? `Pedido #${order.orderId} — datos para transferir`
          : `Pedido #${order.orderId} confirmado`,
      html: buildBuyerEmailHtml(order),
    });
  } catch (err) {
    console.error("[notifications] Error enviando el mail al comprador:", err);
  }
}

/** Avisa al vendedor (mail + WhatsApp) que hay un pedido nuevo. No lanza — best-effort. */
export async function notifyAdminNewOrder(order: OrderInfo): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!resendKey || !adminEmail) {
    console.error("[notifications] Falta RESEND_API_KEY o ADMIN_EMAIL — no se pudo avisar por mail al vendedor.");
  } else {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: resendFrom(),
        to: adminEmail,
        subject: `Nuevo pedido #${order.orderId} (${order.paymentMethod})`,
        html: buildAdminEmailHtml(order),
      });
    } catch (err) {
      console.error("[notifications] Error avisando por mail al vendedor:", err);
    }
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, TWILIO_WHATSAPP_TO } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !TWILIO_WHATSAPP_TO) {
    console.error("[notifications] Faltan credenciales de Twilio — no se pudo avisar por WhatsApp al vendedor.");
    return;
  }
  try {
    const client = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    await client.messages.create({
      from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${TWILIO_WHATSAPP_TO}`,
      body: adminWhatsappBody(order),
    });
  } catch (err) {
    console.error("[notifications] Error avisando por WhatsApp al vendedor:", err);
  }
}

export interface ContactMessage {
  nombre: string;
  email: string;
  mensaje: string;
}

/** Manda al vendedor (ADMIN_EMAIL) la consulta del formulario de Contacto. Responder el mail le contesta al cliente. */
export async function sendContactMessage(msg: ContactMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!apiKey || !adminEmail) {
    console.error("[notifications] Falta RESEND_API_KEY o ADMIN_EMAIL — no se pudo enviar la consulta de contacto.");
    return false;
  }
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: resendFrom(),
      to: adminEmail,
      replyTo: msg.email,
      subject: `Consulta de ${msg.nombre} desde la web`,
      html: `
        <div style="font:400 15px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#41284B;max-width:560px;">
          <div style="background:#41284B;padding:18px 22px;border-radius:12px 12px 0 0;">${logoHeaderHtml()}</div>
          <div style="border:1px solid #E5DDE6;border-top:none;padding:22px;border-radius:0 0 12px 12px;">
            <p style="margin:0 0 6px;"><strong>Nombre:</strong> ${escapeHtml(msg.nombre)}</p>
            <p style="margin:0 0 16px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(msg.email)}" style="color:#41284B;">${escapeHtml(msg.email)}</a></p>
            <p style="margin:0;white-space:pre-wrap;">${escapeHtml(msg.mensaje)}</p>
            <p style="margin:20px 0 0;font-size:12px;color:#8A7A8E;">Respondé este mail para contestarle directamente.</p>
          </div>
        </div>`,
    });
    if (error) {
      console.error("[notifications] Resend rechazó la consulta de contacto:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[notifications] Error enviando la consulta de contacto:", err);
    return false;
  }
}
