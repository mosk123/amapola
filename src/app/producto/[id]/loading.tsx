import { LoadingRegion, Skel, SkelText } from "@/components/Skeleton";

/** Mientras carga un producto: foto grande + miniaturas a la izquierda, datos a la derecha. */
export default function ProductLoading() {
  return (
    <LoadingRegion>
      <div style={{ padding: "clamp(24px,4vw,48px) var(--pad)" }}>
        <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <SkelText w={130} h={12} style={{ marginBottom: 28 }} />
          <div className="split" style={{ alignItems: "start" }}>
            <div>
              <Skel h="auto" round="var(--radius)" style={{ aspectRatio: "4 / 5" }} />
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {Array.from({ length: 4 }, (_, i) => <Skel key={i} w={64} h={64} />)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <SkelText w={80} h={10} />
              <Skel w="75%" h={38} />
              <Skel w={120} h={26} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                <SkelText w="100%" />
                <SkelText w="92%" />
                <SkelText w="60%" />
              </div>
              <SkelText w={60} h={10} style={{ marginTop: 10 }} />
              <div style={{ display: "flex", gap: 10 }}>
                <Skel w={34} h={34} round="50%" />
                <Skel w={34} h={34} round="50%" />
              </div>
              <SkelText w={60} h={10} style={{ marginTop: 6 }} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Array.from({ length: 5 }, (_, i) => <Skel key={i} w={64} h={40} round={999} />)}
              </div>
              <Skel h={52} round="var(--btn-radius)" style={{ marginTop: 12 }} />
            </div>
          </div>
        </div>
      </div>
    </LoadingRegion>
  );
}
