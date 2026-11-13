"use client";

import { createContext, useContext } from "react";
import type { Product } from "@/types";

/** Catálogo que viene del servidor (Supabase o, sin base, los productos del código). Solo productos visibles. */
const CatalogContext = createContext<Product[]>([]);

export function CatalogProvider({ products, children }: { products: Product[]; children: React.ReactNode }) {
  return <CatalogContext.Provider value={products}>{children}</CatalogContext.Provider>;
}

export const useCatalog = () => useContext(CatalogContext);
