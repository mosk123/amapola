/**
 * Cálculo de envío — simulado hasta tener cuenta comercial con Andreani.
 * El cuerpo de `calculateShipping` se va a reemplazar por un fetch real a la
 * API de Andreani; la firma (parámetros y forma del resultado) no debería cambiar.
 */

// Tope que subsidiamos nosotros — ningún envío le cuesta al cliente más que esto.
export const MAX_SHIPPING_SUBSIDY = 5000;

// Coincide con "Envío gratis desde $60.000" ya publicado en la home.
const FREE_SHIPPING_THRESHOLD = 60000;

type ShippingZone = "caba-gba" | "interior";

const ZONE_COST: Record<ShippingZone, number> = {
  "caba-gba": 3500,
  interior: 6500,
};

const ZONE_LABEL: Record<ShippingZone, string> = {
  "caba-gba": "CABA / GBA",
  interior: "Interior del país",
};

function resolveZone(postalCode: string): ShippingZone {
  const normalized = postalCode.trim().toUpperCase();
  const numeric = parseInt(normalized.replace(/\D/g, ""), 10);
  const isCabaGba = normalized.startsWith("C") || (numeric >= 1000 && numeric <= 1999);
  return isCabaGba ? "caba-gba" : "interior";
}

export async function calculateShipping(
  postalCode: string,
  cartTotal: number
): Promise<{ cost: number; label: string }> {
  // Simula la latencia de una llamada real a la API de Andreani.
  await new Promise((resolve) => setTimeout(resolve, 300));

  const zone = resolveZone(postalCode);
  const label = ZONE_LABEL[zone];

  if (cartTotal >= FREE_SHIPPING_THRESHOLD) {
    return { cost: 0, label: `${label} · envío gratis` };
  }

  const cost = Math.min(ZONE_COST[zone], MAX_SHIPPING_SUBSIDY);
  return { cost, label };
}
