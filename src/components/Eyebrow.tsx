interface EyebrowProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function Eyebrow({ children, style = {} }: EyebrowProps) {
  return (
    <span style={{
      font: "700 11px/1 var(--ui-font)",
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: "var(--accent)",
      ...style,
    }}>
      {children}
    </span>
  );
}
