/** Datos del negocio que no son secretos pero tampoco están en el código de UI. */

// TODO: alias real cuando lo tengamos — por ahora inventado a pedido, para poder probar el flujo.
export const TRANSFER_ALIAS = "amapola.tejidos.mp";

// WhatsApp de Amapola tal como se muestra en el mail de transferencia (mismo que WHATSAPP_NUMBER).
export const ADMIN_WHATSAPP_DISPLAY = "2324-314833";

export const TRANSFER_DISCOUNT_RATE = 0.1;

// Máximo de prendas por pedido (frena que alguien reserve todo el catálogo de una vez)
export const MAX_ITEMS_PER_ORDER = 6;

// Recargo sobre todos los precios cargados (0.05 = 5%). Poné 0 para sacarlo.
export const PRICE_MARKUP = 0.05;

// WhatsApp de atención (Contacto y "¿Te enamoraste de este tejido?" en el producto)
export const WHATSAPP_NUMBER = "5492324314833";
export const whatsappLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

// Redes sociales (corazón del menú y tarjetas de Contacto)
export const SOCIAL = {
  instagram: { label: "Instagram", handle: "@amapola.knit", url: "https://www.instagram.com/amapola.knit/" },
  facebook: { label: "Facebook", handle: "amapola.knitwear", url: "https://www.facebook.com/amapola.knitwear" },
};
