"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { CartItem, ColorKey, Product } from "@/types";
import { priceOf } from "@/lib/data";
import { useCatalog } from "@/context/CatalogContext";

/**
 * El carrito se guarda en el navegador (solo qué prenda, color y talle) para que no se pierda
 * si la página se recarga entera — por ejemplo, la primera navegación después de un deploy.
 * Al cargarlo se rearma con el catálogo actual: precios al día y sin prendas que ya no estén.
 */
const STORAGE_KEY = "amapola-cart-v1";
type StoredLine = { id: string; color: string; size: string };

function restoreCart(catalog: Product[]): CartItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    const out: CartItem[] = [];
    for (const line of raw as StoredLine[]) {
      const product = catalog.find((p) => p.id === line?.id);
      const color = line?.color as ColorKey;
      if (!product || !product.colors.includes(color) || product.soldOut?.includes(color)) continue;
      if (typeof line.size !== "string") continue;
      out.push({ ...product, price: priceOf(product, color), color, size: line.size, qty: 1 });
    }
    return out;
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    const lines: StoredLine[] = items.map((i) => ({ id: i.id, color: i.color, size: i.size }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Navegador sin almacenamiento (modo privado estricto): el carrito sigue funcionando en memoria
  }
}

interface CartContextValue {
  items: CartItem[];
  /** false hasta leer el carrito guardado (evita mostrar "carrito vacío" por un instante) */
  ready: boolean;
  cartOpen: boolean;
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product, color: ColorKey, size: string) => void;
  removeFromCart: (index: number) => void;
  updateQty: (index: number, delta: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const catalog = useCatalog();
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Leer el carrito guardado una sola vez, al montar (en el servidor no hay localStorage)
  useEffect(() => {
    const restored = restoreCart(catalog);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza con localStorage al montar
    setItems((prev) => (prev.length > 0 ? prev : restored));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) saveCart(items);
  }, [items, ready]);

  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = useCallback((product: Product, color: ColorKey, size: string) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.id === product.id && it.color === color && it.size === size
      );
      // Cada prenda es única: si ya está en el carrito no se suma otra
      if (idx >= 0) return prev;
      // Precio del color elegido (algunos colores cuestan distinto)
      return [...prev, { ...product, price: priceOf(product, color), color, size, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQty = useCallback((index: number, delta: number) => {
    setItems((prev) =>
      // Máximo 1 por prenda (son únicas)
      prev.map((it, i) => i === index ? { ...it, qty: Math.min(1, Math.max(1, it.qty + delta)) } : it)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider value={{
      items, ready, cartOpen, cartCount, subtotal,
      addToCart, removeFromCart, updateQty, clearCart,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
