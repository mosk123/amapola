import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import { verifyOrderAction } from "@/lib/order-actions";
import { getReservation, TRANSFER_PAID, TRANSFER_PENDING, type ReservationItem } from "@/lib/catalog";
import { COLORS } from "@/lib/data";
import { TRANSFER_RESERVATION_HOURS } from "@/lib/store-config";
import type { ColorKey } from "@/types";

export const metadata: Metadata = { title: "Gestionar pedido", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ a?: string; o?: string; t?: string; r?: string }>;
}

const RESULT_TEXT: Record<string, { text: string; good: boolean }> = {
  confirmado: { text: "Listo: el pago quedó confirmado y la venta es firme.", good: true },
  liberado: { text: "Listo: las prendas volvieron a estar disponibles en la tienda.", good: true },
  "sin-cambios": { text: "No hubo cambios: el pedido ya estaba confirmado, liberado o vencido.", good: false },
};

/**
 * Página que abren los botones del mail de "pedido nuevo" (transferencia).
 * Mostrar esta página no cambia nada: la acción se ejecuta solo con el botón (POST).
 */
export default async function GestionarPedidoPage({ searchParams }: Props) {
  const { a, o, t, r } = await searchParams;

  if (!verifyOrderAction(a, o, t)) {
    return <Shell title="Link inválido"><P>Este link no es válido o está incompleto. Usá el botón del mail del pedido.</P></Shell>;
  }
  const action = a as "confirmar" | "liberar";
  const orderId = o as string;

  let items: ReservationItem[] = [];
  let loadError = false;
  try {
    items = await getReservation(orderId);
  } catch (err) {
    console.error("[pedido] No se pudo leer el pedido:", err);
    loadError = true;
  }

  const pending = items.filter((i) => i.paymentRef === TRANSFER_PENDING + orderId);
  const paid = items.filter((i) => i.paymentRef === TRANSFER_PAID + orderId);
  const expiresAt = pending[0]?.soldAt
    ? new Date(new Date(pending[0].soldAt).getTime() + TRANSFER_RESERVATION_HOURS * 3600_000)
    : null;
  const result = r ? RESULT_TEXT[r] : undefined;

  let state: string;
  if (loadError) state = "No pudimos leer el pedido. Probá de nuevo en un rato.";
  else if (paid.length > 0) state = "Pago confirmado: la venta es firme.";
  else if (pending.length > 0) state = `Reservado, esperando la transferencia. Vence el ${fmtDate(expiresAt)} si no se confirma.`;
  else state = "Sin prendas reservadas: el pedido ya se liberó o venció, y las prendas volvieron a la tienda.";

  const canAct = !loadError && pending.length > 0;

  return (
    <Shell title={action === "confirmar" ? "Confirmar pago recibido" : "Liberar prendas"}>
      <p style={{ margin: 0, font: "500 12px/1.4 'IBM Plex Mono', monospace", color: "var(--muted)" }}>Pedido #{orderId}</p>

      {result && (
        <p style={{
          margin: 0, padding: "12px 16px", borderRadius: "var(--radius-sm)",
          background: result.good ? "var(--bg-2)" : "var(--surface)", border: "1px solid var(--line)",
          font: "600 14px/1.5 var(--ui-font)", color: "var(--ink)",
        }}>{result.text}</p>
      )}

      <P><strong>Estado:</strong> {state}</P>

      {items.length > 0 && (
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((i, k) => (
            <li key={k} style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", background: "var(--surface)", font: "400 14px/1.4 var(--ui-font)", color: "var(--ink)" }}>
              <strong>{i.name}</strong> · {COLORS[i.color as ColorKey]?.label ?? i.color} · talle {i.size}
            </li>
          ))}
        </ul>
      )}

      {canAct && (
        <form method="post" action="/api/pedido/gestionar" style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
          <input type="hidden" name="a" value={action} />
          <input type="hidden" name="o" value={orderId} />
          <input type="hidden" name="t" value={t} />
          <P>
            {action === "confirmar"
              ? "Tocá el botón solo si ya te llegó la transferencia. La venta queda firme y la reserva deja de vencer."
              : "Tocá el botón si el comprador no va a pagar. Las prendas vuelven a estar disponibles en la tienda."}
          </P>
          <button type="submit" style={{
            padding: "15px 24px", borderRadius: "var(--btn-radius)", border: "none", cursor: "pointer",
            background: action === "confirmar" ? "var(--accent)" : "var(--ink)", color: "var(--accent-ink)",
            font: "700 15px/1 var(--ui-font)",
          }}>
            {action === "confirmar" ? "Sí, el pago llegó" : "Sí, liberar las prendas"}
          </button>
        </form>
      )}
    </Shell>
  );
}

function fmtDate(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) + " h";
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "clamp(40px,8vw,96px) var(--pad)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <Eyebrow style={{ display: "block", marginBottom: 10 }}>Pedido por transferencia</Eyebrow>
          <h1 style={{ margin: 0, font: "var(--h1-font)", color: "var(--ink)" }}>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: 0, font: "400 15px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>{children}</p>;
}
