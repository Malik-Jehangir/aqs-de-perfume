import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Perfume } from "../types";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type CartItem = {
  perfume: Perfume;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (perfume: Perfume) => void;
  removeFromCart: (perfumeId: string) => void;

  increaseQty: (perfumeId: string) => void;
  decreaseQty: (perfumeId: string) => void;
  setQty: (perfumeId: string, qty: number) => void;

  totalItems: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const getCartDocId = () => {
  const user = auth.currentUser;
  return user ? user.uid : "guest";
};

const removeUndefinedDeep = (value: any): any => {
  if (Array.isArray(value)) return value.map(removeUndefinedDeep);
  if (value && typeof value === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined) continue;
      out[k] = removeUndefinedDeep(v);
    }
    return out;
  }
  return value;
};

const normalizePerfume = (p: any): Perfume => ({
  id: p?.id ?? "",
  name: p?.name ?? "",
  brand: p?.brand ?? "",
  description: p?.description ?? "",
  price: typeof p?.price === "number" ? p.price : 0,
  imageUrl: p?.imageUrl ?? "",
  notes: Array.isArray(p?.notes) ? p.notes : [],

  tagline: p?.tagline ?? "",
  quote: p?.quote ?? "",
  stockText: p?.stockText ?? "In Stock",
  currency: p?.currency ?? "BHD",
  volume: p?.volume ?? "",
  longevity: p?.longevity ?? "",
  bestSeason: p?.bestSeason ?? "",
  bestTime: p?.bestTime ?? "",
  occasions: Array.isArray(p?.occasions) ? p.occasions : [],
  perfectFor: Array.isArray(p?.perfectFor) ? p.perfectFor : [],
});

const saveCartToFirestore = async (items: CartItem[]) => {
  const cartId = getCartDocId();
  const cartRef = doc(db, "carts", cartId);

  const plainItems = items.map((item) => ({
    perfume: item.perfume,
    quantity: item.quantity,
  }));

  await setDoc(cartRef, removeUndefinedDeep({ items: plainItems, updatedAt: Date.now() }), {
    merge: true,
  });
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        const cartId = user ? user.uid : "guest";
        const cartRef = doc(db, "carts", cartId);
        const snapshot = await getDoc(cartRef);

        if (snapshot.exists()) {
          const data = snapshot.data() as { items?: any[] };
          const itemsFromDb: CartItem[] = (data.items || []).map((item) => ({
            perfume: normalizePerfume(item.perfume),
            quantity: typeof item.quantity === "number" ? item.quantity : 1,
          }));
          setItems(itemsFromDb);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
        setItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addToCart = (perfume: Perfume) => {
    const safe = normalizePerfume(perfume);

    setItems((prev) => {
      const existing = prev.find((item) => item.perfume.id === safe.id);
      let updated: CartItem[];

      if (existing) {
        updated = prev.map((item) =>
          item.perfume.id === safe.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prev, { perfume: safe, quantity: 1 }];
      }

      void saveCartToFirestore(updated);
      return updated;
    });
  };

  const removeFromCart = (perfumeId: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.perfume.id !== perfumeId);
      void saveCartToFirestore(updated);
      return updated;
    });
  };

  const increaseQty = (perfumeId: string) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.perfume.id === perfumeId ? { ...item, quantity: item.quantity + 1 } : item
      );
      void saveCartToFirestore(updated);
      return updated;
    });
  };

  const decreaseQty = (perfumeId: string) => {
    setItems((prev) => {
      const updated = prev
        .map((item) =>
          item.perfume.id === perfumeId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      void saveCartToFirestore(updated);
      return updated;
    });
  };

  const setQty = (perfumeId: string, qty: number) => {
    const safeQty = Number.isFinite(qty) ? Math.max(0, Math.floor(qty)) : 0;

    setItems((prev) => {
      const updated =
        safeQty === 0
          ? prev.filter((item) => item.perfume.id !== perfumeId)
          : prev.map((item) =>
              item.perfume.id === perfumeId ? { ...item, quantity: safeQty } : item
            );

      void saveCartToFirestore(updated);
      return updated;
    });
  };

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        setQty,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
