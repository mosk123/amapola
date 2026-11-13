/** Bloques de carga (skeletons). Sin estado: se pueden usar en loading.tsx del servidor. */

type Size = number | string;

export function Skel({ w = "100%", h = 12, round, style }: { w?: Size; h?: Size; round?: Size; style?: React.CSSProperties }) {
  return <div className="skel" aria-hidden style={{ width: w, height: h, borderRadius: round, ...style }} />;
}

/** Línea de texto (más finita y redondeada). */
export function SkelText({ w = "100%", h = 12, style }: { w?: Size; h?: number; style?: React.CSSProperties }) {
  return <div className="skel skel-text" aria-hidden style={{ width: w, height: h, ...style }} />;
}

/** Igual que ProductCard: foto cuadrada + nombre/precio + descripción + colores. */
export function ProductCardSkeleton() {
  return (
    <div
      className="pcard"
      aria-hidden
      style={{
        display: "flex", flexDirection: "column", minWidth: 0,
        background: "var(--surface)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)",
      }}
    >
      <Skel h="auto" style={{ aspectRatio: "1 / 1" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 9, paddingTop: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <SkelText w="55%" h={14} />
          <SkelText w="25%" h={14} />
        </div>
        <SkelText w="85%" />
        <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
          <Skel w={14} h={14} round="50%" />
          <Skel w={14} h={14} round="50%" />
        </div>
      </div>
    </div>
  );
}

/** Pantalla de carga accesible: los lectores de pantalla anuncian "Cargando…". */
export function LoadingRegion({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" aria-busy="true">
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Cargando…</span>
      {children}
    </div>
  );
}
