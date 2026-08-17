import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";

interface ResultPageProps {
  icon: Parameters<typeof Icon>[0]["name"];
  eyebrow: string;
  title: string;
  message: string;
  paymentId?: string;
  accentColor?: string;
}

export default function ResultPage({
  icon, eyebrow, title, message, paymentId, accentColor = "var(--accent)",
}: ResultPageProps) {
  return (
    <div style={{ padding: "clamp(60px,10vw,120px) var(--pad)", textAlign: "center" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <span style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "var(--bg-2)", border: "1px solid var(--line)",
          display: "grid", placeItems: "center", color: accentColor,
        }}>
          <Icon name={icon} size={32} />
        </span>
        <div>
          <Eyebrow style={{ display: "block", marginBottom: 10 }}>{eyebrow}</Eyebrow>
          <h1 style={{ margin: 0, font: "var(--h1-font)", color: "var(--ink)" }}>{title}</h1>
        </div>
        <p style={{ margin: 0, font: "400 16px/1.6 var(--ui-font)", color: "var(--ink-soft)" }}>{message}</p>
        {paymentId && (
          <p style={{ margin: 0, font: "500 12px/1.4 'IBM Plex Mono', monospace", color: "var(--muted)" }}>
            Pago #{paymentId}
          </p>
        )}
        <Link href="/catalogo" style={{
          marginTop: 8, padding: "13px 28px", borderRadius: "var(--btn-radius)",
          background: "var(--accent)", color: "var(--accent-ink)",
          font: "700 14px/1 var(--ui-font)", textDecoration: "none",
        }}>
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
