"use client";

import { useState } from "react";
import Image from "next/image";
import type { ImageTone } from "@/types";
import { cloudinaryLoader, isCloudinary } from "@/lib/cloudinary";

const TONES: Record<ImageTone, [string, string]> = {
  blush:   ["var(--blush)", "var(--bg-2)"],
  sage:    ["#C9D4BD", "#DCE3D2"],
  caramel: ["#E2C9A6", "#EEDFC8"],
  rosa:    ["#EAD3CB", "#F2E2DC"],
};

interface PhotoProps {
  src?: string;
  /** Segunda foto, se muestra encima (con fundido) cuando `showAlt` es true. */
  altSrc?: string;
  showAlt?: boolean;
  alt?: string;
  label?: string;
  tone?: ImageTone;
  ratio?: string;
  round?: string | number;
  className?: string;
  children?: React.ReactNode;
}

export default function Photo({
  src,
  altSrc,
  showAlt = false,
  alt,
  label = "",
  tone = "blush",
  ratio = "1 / 1",
  round,
  className,
  children,
}: PhotoProps) {
  const [a, b] = TONES[tone];
  // Fotos que fallaron al cargar (ej: todavía no se copiaron a la carpeta) → se muestra el placeholder
  const [failed, setFailed] = useState<Record<string, true>>({});
  const markFailed = (s: string) => setFailed((f) => ({ ...f, [s]: true }));
  // Fotos que ya terminaron de bajar: hasta entonces se ve el skeleton y después aparecen con fundido
  const [loaded, setLoaded] = useState<Record<string, true>>({});
  const markLoaded = (s: string) => setLoaded((l) => ({ ...l, [s]: true }));
  const okSrc = src && !failed[src] ? src : undefined;
  const okAlt = altSrc && !failed[altSrc] ? altSrc : undefined;
  const borderRadius = round != null ? round : "var(--radius)";

  return (
    <div
      className={[className, okSrc && !loaded[okSrc] ? "photo-loading" : ""].filter(Boolean).join(" ") || undefined}
      style={{
        position: "relative",
        aspectRatio: ratio,
        width: "100%",
        overflow: "hidden",
        borderRadius,
        background: okSrc ? undefined : `repeating-linear-gradient(135deg, ${a} 0 9px, ${b} 9px 18px)`,
      }}
    >
      {okSrc ? (
        <Image
          src={okSrc}
          loader={isCloudinary(okSrc) ? cloudinaryLoader : undefined}
          alt={alt || label || ""}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover", opacity: loaded[okSrc] ? 1 : 0, transition: "opacity .45s ease, scale .7s cubic-bezier(.2,.7,.2,1)" }}
          onLoad={() => markLoaded(okSrc)}
          onError={() => markFailed(okSrc)}
        />
      ) : (
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
      )}
      {okSrc && okAlt && (
        <Image
          src={okAlt}
          loader={isCloudinary(okAlt) ? cloudinaryLoader : undefined}
          alt={alt || label || ""}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover", opacity: showAlt ? 1 : 0, transition: "opacity .35s ease, scale .7s cubic-bezier(.2,.7,.2,1)" }}
          onError={() => markFailed(okAlt)}
        />
      )}
      {children}
    </div>
  );
}
