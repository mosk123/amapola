/**
 * Envío con precio fijo a todo el país (Correo Argentino, PAQ.AR Clásico desde Mercedes).
 * Cotizado en MiCorreo con paquete de 1 kg: sucursal $6.739–$7.745, domicilio $10.227–$11.221.
 * Para cambiar los precios, editá SHIPPING_OPTIONS.
 */

export type ShippingMethod = "sucursal" | "domicilio" | "mercedes";

export const SHIPPING_OPTIONS: Record<ShippingMethod, { cost: number; label: string; description: string }> = {
  sucursal: {
    cost: 8000,
    label: "Retiro en sucursal del Correo",
    description: "Lo retirás en la sucursal de Correo Argentino más cercana a tu código postal.",
  },
  domicilio: {
    cost: 11500,
    label: "Envío a domicilio",
    description: "Correo Argentino te lo lleva a la dirección que cargaste.",
  },
  mercedes: {
    cost: 0,
    label: "Envío a domicilio en Mercedes",
    description: "Gratis para Mercedes (CP 6600): te lo llevamos nosotras a tu casa.",
  },
};

export const isShippingMethod = (v: unknown): v is ShippingMethod =>
  typeof v === "string" && v in SHIPPING_OPTIONS;

/** ¿El código postal es de Mercedes (6600)? Acepta "6600" y el formato nuevo "B6600ABC". */
export function isMercedesPostalCode(postalCode: string): boolean {
  return /^[a-z]?\s*6600\s*([a-z]{3})?$/i.test(postalCode.trim());
}

/**
 * Opciones de envío que se ofrecen según el código postal: en Mercedes el envío a domicilio
 * es gratis (reemplaza al pago); en el resto del país, sucursal o domicilio por Correo.
 */
export function availableShippingMethods(postalCode: string): ShippingMethod[] {
  return isMercedesPostalCode(postalCode) ? ["mercedes", "sucursal"] : ["sucursal", "domicilio"];
}

export const isShippingAvailable = (method: ShippingMethod, postalCode: string): boolean =>
  availableShippingMethods(postalCode).includes(method);

/** Costo y texto del envío elegido (misma forma que usan las notificaciones). */
export function shippingFor(method: ShippingMethod): { cost: number; label: string } {
  const { cost, label } = SHIPPING_OPTIONS[method];
  return { cost, label };
}
