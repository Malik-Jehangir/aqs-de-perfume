import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
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
  totalItems: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const getCartDocId = () => {
  const user = auth.currentUser;
  return user ? user.uid : "guest";
};

const saveCartToFirestore = async (items: CartItem[]) => {
  const cartId = getCartDocId();
  const cartRef = doc(db, "carts", cartId);

  

  const plainItems = items.map((item) => ({
    perfume: item.perfume,
    quantity: item.quantity,
  }));

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

await setDoc(cartRef, removeUndefinedDeep({ items: plainItems }), { merge: true });
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
            perfume: item.perfume,
            quantity: item.quantity,
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
    setItems((prev) => {
      const existing = prev.find((item) => item.perfume.id === perfume.id);
      let updated: CartItem[];

      if (existing) {
        updated = prev.map((item) =>
          item.perfume.id === perfume.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { perfume, quantity: 1 }];
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

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};
