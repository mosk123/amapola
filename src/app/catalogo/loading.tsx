import { LoadingRegion, ProductCardSkeleton, Skel, SkelText } from "@/components/Skeleton";

/** Mientras carga el catálogo: encabezado, filtros y grilla de cards. */
export default function CatalogLoading() {
  return (
    <LoadingRegion>
      <div style={{ borderBottom: "1px solid var(--line)", paddingTop: "clamp(32px,5vw,56px)" }}>
        <div className="wrap">
          <div className="skel-center-desktop" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <SkelText w={90} h={10} />
            <Skel w="min(340px, 80%)" h={40} />
          </div>
          <div style={{ display: "flex", gap: 8, padding: "24px 0 16px" }}>
            <Skel w={92} h={36} round={999} />
            <Skel w={92} h={36} round={999} />
            <Skel w={92} h={36} round={999} />
          </div>
        </div>
      </div>
      <div className="wrap" style={{ padding: "32px var(--pad) clamp(48px,6vw,84px)" }}>
        <SkelText w={70} h={10} style={{ marginBottom: 20 }} />
        <div className="grid-cards grid-cards--fill">
          {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </LoadingRegion>
  );
}
