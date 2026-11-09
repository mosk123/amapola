"use client";

import { useEffect } from "react";
import Icon from "./Icon";
import type { MeasureRow, MeasureTable } from "@/types";

interface SizeGuideProps {
  open: boolean;
  onClose: () => void;
  tables: MeasureTable[];
  /** Talle a resaltar por tabla (por título; "" = tabla sin título). */
  highlight?: Record<string, string | undefined>;
}

const COLS: { key: keyof Omit<MeasureRow, "size">; label: string }[] = [
  { key: "largo", label: "Largo" },
  { key: "ancho", label: "Ancho" },
  { key: "sisa", label: "Sisa" },
  { key: "manga", label: "Largo de manga" },
];

/** Panel con la guía de talles: dibujo de cómo se mide + tabla en cm. En mobile se abre desde abajo. */
export default function SizeGuide({ open, onClose, tables, highlight = {} }: SizeGuideProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="sheet-overlay"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        background: "color-mix(in srgb, var(--brand-plum) 45%, transparent)",
        display: "grid", placeItems: "center", padding: 20,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Guía de talles"
        className="sheet-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(600px, 100%)", maxHeight: "85vh", overflowY: "auto",
          background: "var(--surface)", borderRadius: "var(--radius)",
          boxShadow: "var(--shadow-hover)", padding: "24px clamp(18px, 4vw, 28px) 28px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0, font: "var(--h2-font)", color: "var(--ink)" }}>Guía de talles</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              width: 38, height: 38, borderRadius: "50%", border: "none", cursor: "pointer",
              display: "grid", placeItems: "center", background: "var(--bg-2)", color: "var(--ink)",
            }}
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        <p style={{ margin: "6px 0 0", font: "400 13px/1.5 var(--ui-font)", color: "var(--ink-soft)" }}>
          Medidas en centímetros, tomadas con la prenda apoyada sobre una superficie plana.
        </p>

        {tables.map((t) => {
          const cols = COLS.filter((c) => t.rows.some((r) => r[c.key] !== undefined));
          const hl = highlight[t.title ?? ""];
          return (
            <section key={t.title ?? "tabla"} style={{ marginTop: 24 }}>
              {tables.length > 1 && t.title && (
                <h3 style={{ margin: "0 0 12px", font: "var(--h3-font)", color: "var(--ink)" }}>{t.title}</h3>
              )}
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 auto", width: 200, margin: "0 auto" }}>
                  <Diagram shape={t.shape} sisa={cols.some((c) => c.key === "sisa")} manga={cols.some((c) => c.key === "manga")} />
                </div>
                <div style={{ flex: "1 1 260px", minWidth: 0, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", font: "400 13px/1.3 var(--ui-font)", color: "var(--ink)" }}>
                    <thead>
                      <tr>
                        {["Talle", ...cols.map((c) => c.label)].map((h) => (
                          <th key={h} style={{
                            textAlign: "left", padding: "8px 10px", whiteSpace: "nowrap",
                            font: "700 11px/1.2 var(--ui-font)", letterSpacing: ".06em", textTransform: "uppercase",
                            color: "var(--muted)", borderBottom: "1.5px solid var(--line-strong)",
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.rows.map((r) => {
                        const on = r.size === hl;
                        return (
                          <tr key={r.size} style={{ background: on ? "var(--bg-2)" : "transparent" }}>
                            <td style={{ ...TD, fontWeight: 700 }}>{r.size}</td>
                            {cols.map((c) => (
                              <td key={c.key} style={{ ...TD, fontWeight: on ? 700 : 400 }}>{r[c.key] ?? "—"}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

const TD: React.CSSProperties = {
  padding: "9px 10px", borderBottom: "1px solid var(--line)", whiteSpace: "nowrap",
};

/* ── Dibujo de cómo se mide cada prenda ── */

function Diagram({ shape, sisa, manga }: { shape: "top" | "bottom"; sisa: boolean; manga: boolean }) {
  return (
    <svg viewBox="-34 -20 260 210" width="100%" role="img" aria-label="Cómo se mide la prenda" style={{ display: "block" }}>
      {shape === "top" ? (
        <>
          {/* Con largo de manga se dibuja manga larga (sweater); si no, manga corta */}
          <path
            d={manga
              ? "M85 14 Q100 28 115 14 L140 20 L188 118 L170 126 L140 62 L140 150 L60 150 L60 62 L30 126 L12 118 L60 20 Z"
              : "M85 14 Q100 28 115 14 L140 20 L175 50 L160 64 L140 52 L140 150 L60 150 L60 52 L40 64 L25 50 L60 20 Z"}
            fill="var(--bg-2)" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round"
          />
          <Dim x1={100} y1={26} x2={100} y2={146} label="Largo" lx={106} ly={104} />
          <Dim x1={60} y1={164} x2={140} y2={164} label="Ancho" lx={100} ly={184} anchor="middle" />
          {sisa && <Dim x1={133} y1={24} x2={133} y2={manga ? 62 : 52} label="Sisa" lx={127} ly={manga ? 48 : 43} anchor="end" />}
          {manga && <Dim x1={54} y1={16} x2={4} y2={114} label="Manga" lx={20} ly={56} anchor="end" />}
        </>
      ) : (
        <>
          <path
            d="M60 15 L140 15 L150 160 L108 160 L100 72 L92 160 L50 160 Z"
            fill="var(--bg-2)" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round"
          />
          <Dim x1={164} y1={15} x2={164} y2={160} label="Largo" lx={170} ly={94} />
          <Dim x1={60} y1={2} x2={140} y2={2} label="Ancho" lx={100} ly={-6} anchor="middle" />
        </>
      )}
    </svg>
  );
}

function Dim({ x1, y1, x2, y2, label, lx, ly, anchor = "start" }: {
  x1: number; y1: number; x2: number; y2: number; label: string; lx: number; ly: number; anchor?: "start" | "middle" | "end";
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent)" strokeWidth="1.8" strokeDasharray="4 3" />
      <circle cx={x1} cy={y1} r="2.8" fill="var(--accent)" />
      <circle cx={x2} cy={y2} r="2.8" fill="var(--accent)" />
      <text x={lx} y={ly} textAnchor={anchor} style={{ font: "700 14px var(--ui-font)", fill: "var(--accent)" }}>
        {label}
      </text>
    </g>
  );
}
