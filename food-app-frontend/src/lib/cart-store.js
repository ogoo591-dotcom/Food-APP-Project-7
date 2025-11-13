"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const add = useCallback((dish, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x._id === dish._id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: (copy[i].qty || 1) + qty };
        return copy;
      }
      return [...prev, { ...dish, qty }];
    });
    setOpen(true);
  }, []);

  const inc = useCallback((id) => {
    setItems((prev) =>
      prev.map((x) => (x._id === id ? { ...x, qty: (x.qty || 1) + 1 } : x))
    );
  }, []);

  const dec = useCallback((id) => {
    setItems((prev) =>
      prev.map((x) =>
        x._id === id ? { ...x, qty: Math.max(1, (x.qty || 1) - 1) } : x
      )
    );
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x._id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((s, x) => s + (x.qty || 1), 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      open,
      setOpen,
      add,
      inc,
      dec,
      remove,
      clear,
    }),
    [items, count, open, add, inc, dec, remove, clear]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
