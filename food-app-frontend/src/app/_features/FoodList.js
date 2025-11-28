"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FoodCards } from "../_component/FoodCards";

const backend_url = process.env.PUBLIC_BACKEND_URL;

export default function FoodList() {
  const [cats, setCats] = useState([]);
  const [cart, setCart] = useState([]);

  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [byCat, setByCat] = useState({});
  const [flash, setFlash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const rc = await fetch(`${backend_url}/foodCategory`);
        const categories = await rc.json();
        setCats(categories);

        const foodsArrays = await Promise.all(
          categories.map((c) =>
            fetch(`${backend_url}/food/category/${c._id}`)
              .then((r) => r.json())
              .catch(() => [])
          )
        );

        const map = {};
        categories.forEach((c, i) => {
          map[c._id] = foodsArrays[i] || [];
        });
        setByCat(map);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const addToCart = useCallback((dish, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x._id === dish._id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: (next[i].qty || 1) + qty };
        return next;
      }
      return [...prev, { ...dish, qty }];
    });

    setSelectedIds((prev) => {
      const s = new Set(prev);
      s.add(dish._id);
      return s;
    });

    setFlash({ name: dish.foodName, qty });
    setTimeout(() => setFlash(null), 1200);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((s, x) => s + (x.qty || 1), 0),
    [cart]
  );

  if (loading) return <div className="p-6 text-neutral-500">Loading…</div>;

  return (
    <main className=" bg-neutral-800 min-h-screen">
      {cats.map((c) => {
        const foods = byCat[c._id] || [];
        if (!foods.length) return null;

        return (
          <section key={c._id} className=" py-10 px-20">
            <h2 className="mb-4 py-5 text-3xl font-bold text-white">
              {c.categoryName}
            </h2>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {foods.map((dish) => (
                <FoodCards
                  key={dish._id}
                  dish={dish}
                  isSelected={selectedIds.has(dish._id)}
                  onAdd={() => addToCart(dish, 1)}
                />
              ))}
            </div>
          </section>
        );
      })}
      {flash && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-black text-white px-4 py-2 shadow">
          Added {flash.qty} × {flash.name}
        </div>
      )}
    </main>
  );
}
