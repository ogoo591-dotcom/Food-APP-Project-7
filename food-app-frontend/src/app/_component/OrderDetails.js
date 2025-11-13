"use client";
import { useEffect, useState } from "react";
import { SumIcon } from "../_icons/Sum";

export default function OrderDetails({ foodId, count = 0 }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open || !foodId || items.length) return;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`http://localhost:4000/foodOrder/${foodId}`, {
          cache: "no-store",
        });
        const data = await res.json();

        const raw = data?.foodOrderItems || data?.items || [];
        const norm = raw.map((it) => ({
          id: String(it._id ?? it.id ?? Math.random()),
          name: it.food?.foodName ?? it.foodName ?? "Unknown",
          image: it.food?.image ?? it.image ?? "",
          qty: it.quantity ?? it.qty ?? 1,
        }));
        setItems(norm);
      } catch (e) {
        setErr("Failed to load items");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, foodId, items.length]);

  return (
    <div
      className="relative"
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-neutral-100"
        aria-expanded={open}
        aria-controls={`order-items-${foodId}`}
      >
        <span className="font-normal">{count} foods</span>
        <span className={`transition ${open ? "rotate-180" : ""}`}>
          <SumIcon />
        </span>
      </button>

      {open && (
        <div
          id={`order-items-${foodId}`}
          className="absolute left-0 z-50 mt-3 w-[300px] max-w-[90vw] rounded-3xl border border-neutral-200 bg-white p-3 shadow-2xl"
        >
          {loading && (
            <p className="py-6 text-center text-sm text-neutral-500">
              Loading…
            </p>
          )}
          {err && (
            <p className="py-6 text-center text-sm text-red-600">{err}</p>
          )}

          {!loading && !err && (
            <ul className="space-y-3">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between border-b last:border-none last:pb-0"
                >
                  <div className="flex items-center gap-5">
                    <img
                      src={it.image || "/placeholder.png"}
                      alt="image"
                      className="h-16 w-16 rounded-l object-cover"
                    />
                    <span className="text-l">{it.foodName}</span>
                  </div>
                  <span className="text-l pr-1">x {it.qty}</span>
                </li>
              ))}
              {items.length === 0 && (
                <li className="py-6 text-center text-sm text-neutral-500">
                  No items.
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
