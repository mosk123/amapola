"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { CartItem, ColorKey, Product } from "@/types";

interface CartContextValue {
  items: CartItem[];
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
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = useCallback((product: Product, color: ColorKey, size: string) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.id === product.id && it.color === color && it.size === size
      );
      if (idx >= 0) {
        return prev.map((it, i) => i === idx ? { ...it, qty: it.qty + 1 } : it);
      }
      return [...prev, { ...product, color, size, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQty = useCallback((index: number, delta: number) => {
    setItems((prev) =>
      prev.map((it, i) => i === index ? { ...it, qty: Math.max(1, it.qty + delta) } : it)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider value={{
      items, cartOpen, cartCount, subtotal,
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
