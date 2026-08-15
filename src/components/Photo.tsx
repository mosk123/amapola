"use client";

import type { ImageTone } from "@/types";

const TONES: Record<ImageTone, [string, string]> = {
  blush:   ["var(--blush)", "var(--bg-2)"],
  sage:    ["#C9D4BD", "#DCE3D2"],
  caramel: ["#E2C9A6", "#EEDFC8"],
  rosa:    ["#EAD3CB", "#F2E2DC"],
};

interface PhotoProps {
  label?: string;
  tone?: ImageTone;
  ratio?: string;
  round?: string | number;
  className?: string;
  children?: React.ReactNode;
}

export default function Photo({
  label = "",
  tone = "blush",
  ratio = "1 / 1",
  round,
  className,
  children,
}: PhotoProps) {
  const [a, b] = TONES[tone];
  const borderRadius = round != null ? round : "var(--radius)";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        aspectRatio: ratio,
        width: "100%",
        overflow: "hidden",
        borderRadius,
        background: `repeating-linear-gradient(135deg, ${a} 0 9px, ${b} 9px 18px)`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        {label && (
          <span style={{
            font: "500 11px/1.4 'IBM Plex Mono', ui-monospace, monospace",
            letterSpacing: ".04em",
            color: "var(--ink-soft)",
            background: "color-mix(in srgb, var(--surface) 78%, transparent)",
            padding: "5px 10px",
            borderRadius: 999,
            textAlign: "center",
            maxWidth: "80%",
          }}>
            {label}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
