"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Anima al hacer scroll los elementos con `data-reveal` (suben apenas y aparecen).
 * - Lo que ya está en pantalla al cargar se deja quieto (nada de parpadeos arriba de todo).
 * - Lo que está más abajo se oculta y aparece cuando entra en pantalla, escalonado.
 * - Con "reducir movimiento" no hace nada. Sin JS todo se ve normal.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        let k = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty("--reveal-delay", `${Math.min(k++, 6) * 80}ms`);
          el.classList.remove("reveal-pending");
          el.classList.add("reveal-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.reveal-in)").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Ya visible al cargar (arriba de todo) → se queda como está, sin animar
        if (!el.classList.contains("reveal-pending") && el.getBoundingClientRect().top < vh * 0.92) return;
        el.classList.add("reveal-pending");
        io.observe(el);
      });
    };

    scan();
    // Cards que aparecen después (filtros del catálogo, carga diferida)
    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
