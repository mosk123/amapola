/**
 * Envío con precio fijo a todo el país (Correo Argentino, PAQ.AR Clásico desde Mercedes).
 * Cotizado en MiCorreo con paquete de 1 kg: sucursal $6.739–$7.745, domicilio $10.227–$11.221.
 * Para cambiar los precios, editá SHIPPING_OPTIONS.
 */

export type ShippingMethod = "sucursal" | "domicilio";

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
};

export const isShippingMethod = (v: unknown): v is ShippingMethod =>
  typeof v === "string" && v in SHIPPING_OPTIONS;

/** Costo y texto del envío elegido (misma forma que usan las notificaciones). */
export function shippingFor(method: ShippingMethod): { cost: number; label: string } {
  const { cost, label } = SHIPPING_OPTIONS[method];
  return { cost, label };
}
