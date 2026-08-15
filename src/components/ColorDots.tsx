"use client";

import { COLORS } from "@/lib/data";
import type { ColorKey } from "@/types";

interface ColorDotsProps {
  colors: ColorKey[];
  size?: number;
  selected?: ColorKey;
  onSelect?: (color: ColorKey) => void;
}

export default function ColorDots({ colors, size = 16, selected, onSelect }: ColorDotsProps) {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {colors.map((c) => (
        <button
          key={c}
          title={COLORS[c]?.label}
          onClick={() => onSelect?.(c)}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: COLORS[c]?.hex,
            boxShadow: selected === c
              ? `0 0 0 2px var(--surface), 0 0 0 3.5px var(--ink)`
              : "inset 0 0 0 1px rgba(0,0,0,.08)",
            border: "none",
            cursor: onSelect ? "pointer" : "default",
            padding: 0,
            transition: "box-shadow .15s ease",
          }}
        />
      ))}
    </div>
  );
}
