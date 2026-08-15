"use client";

import { useState } from "react";
import Icon from "./Icon";

type BtnVariant = "solid" | "outline" | "ghost";
type BtnSize = "sm" | "md" | "lg";

interface BtnProps {
  children: React.ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  onClick?: () => void;
  full?: boolean;
  style?: React.CSSProperties;
  icon?: Parameters<typeof Icon>[0]["name"];
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const SIZES: Record<BtnSize, string> = {
  sm: "9px 16px",
  md: "13px 24px",
  lg: "16px 32px",
};

const BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  fontFamily: "var(--ui-font)",
  fontWeight: "var(--btn-weight, 700)" as unknown as number,
  fontSize: 14,
  lineHeight: 1,
  letterSpacing: ".02em",
  borderRadius: "var(--btn-radius)",
  cursor: "pointer",
  border: "1.5px solid transparent",
  transition: "all .18s ease",
  textTransform: "var(--btn-transform, none)" as React.CSSProperties["textTransform"],
};

const VARIANTS: Record<BtnVariant, React.CSSProperties> = {
  solid:   { background: "var(--accent)", color: "var(--accent-ink, #fff)", borderColor: "var(--accent)" },
  outline: { background: "transparent", color: "var(--ink)", borderColor: "var(--line-strong)" },
  ghost:   { background: "transparent", color: "var(--ink)", borderColor: "transparent" },
};

const HOVER: Record<BtnVariant, React.CSSProperties> = {
  solid:   { filter: "brightness(.95)", transform: "translateY(-1px)" },
  outline: { background: "var(--ink)", color: "var(--bg)" },
  ghost:   { background: "var(--bg-2)" },
};

export default function Btn({
  children,
  variant = "solid",
  size = "md",
  onClick,
  full,
  style = {},
  icon,
  type,
  disabled,
}: BtnProps) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...BASE,
        ...VARIANTS[variant],
        ...(hover ? HOVER[variant] : {}),
        padding: SIZES[size],
        width: full ? "100%" : "auto",
        ...style,
      }}
    >
      {children}
      {icon && <Icon name={icon} size={16} />}
    </button>
  );
}
