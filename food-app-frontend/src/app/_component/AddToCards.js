"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BiCart } from "react-icons/bi";

export default function AddToCards({
  open,
  onOpenChange,
  cart = [],
  onInc,
  onDec,
  onRemove,
  onCheckout,
}) {
  const [location, setLocation] = useState("");

  const itemsTotal = useMemo(
    () =>
      cart.reduce((sum, x) => sum + (Number(x.price) || 0) * (x.qty || 1), 0),
    [cart]
  );
  const shipping = useMemo(
    () => (itemsTotal > 0 ? +(itemsTotal * 0.1).toFixed(2) : 0),
    [itemsTotal]
  );
  const grandTotal = useMemo(
    () => +(itemsTotal + shipping).toFixed(2),
    [itemsTotal, shipping]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[520px] max-w-[92vw] p-0 border-0 bg-transparent">
        <div className="rounded-2xl bg-neutral-600 px-5 pt-4 pb-3">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <BiCart /> Order detail
            <button
              className="ml-auto grid h-8 w-8 place-items-center rounded-full border-gray-300 border text-gray-300 "
              onClick={() => onOpenChange?.(false)}
            >
              ×
            </button>
          </div>
          <div className="flex-1 rounded-full bg-white text-black hover:bg-red-400 hover:text-white px-4 py-2 text-center cursor-pointer mt-4">
            <button className="flex-1 rounded-full bg-white/10 px-4">
              Cart
            </button>
            <button className="flex-1 rounded-full bg-white/10 px-4">
              Order
            </button>
          </div>
          <div className="rounded-2xl bg-white mt-5">
            <div className="px-5 pb-5 pt-4 bg-white rounded-lg">
              <p className="mb-3 text-[20px] font-semibold text-neutral-500">
                My cart
              </p>
              <div className="space-y-5 border-dashed">
                {cart.map((it, i) => (
                  <div
                    key={it.lineId ?? (it._id ? `${it._id}-${i}` : `row-${i}`)}
                    className="border-b pb-4"
                  >
                    <div className="flex gap-3">
                      <img
                        src={it.image || "/placeholder.png"}
                        alt={it.foodName}
                        className="h-35 w-35 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-rose-500">
                          {it.foodName}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[13px] text-neutral-500">
                          {it.ingredients}
                        </p>
                        <div className="mt-12 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => onDec?.(it._id)}
                              className="grid h-8 w-8 place-items-center rounded-full border-none"
                            >
                              –
                            </button>
                            <span className="text-lg font-bold">
                              {it.qty ?? 1}
                            </span>
                            <button
                              onClick={() => onInc?.(it._id)}
                              className="grid h-8 w-8 place-items-center rounded-full border-none"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-semibold">
                            {((Number(it.price) || 0) * (it.qty || 1)).toFixed(
                              2
                            )}{" "}
                            ₮
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove?.(it._id)}
                        className="grid h-9 w-9 place-items-center rounded-full border border-red-400 text-red-400 text-xl"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <p className="mb-2 text-[20px] font-semibold text-neutral-500">
                  Delivery location
                </p>
                <input
                  className="w-full h-20 rounded-lg border px-3 py-3 outline-none"
                  placeholder="Please share your complete address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border p-4 bg-white">
            <p className="mb-3 text-[18px] font-medium text-neutral-600">
              Payment info
            </p>
            <div className="flex items-center justify-between text-sm">
              <span>Items</span>
              <span className="font-semibold">{itemsTotal.toFixed(2)} ₮</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span>Shipping</span>
              <span className="font-semibold">{shipping.toFixed(2)} ₮</span>
            </div>
            <div className="my-3 border-b border-dashed" />
            <div className="flex items-center justify-between text-base">
              <span>Total</span>
              <span className="font-semibold">{grandTotal} ₮</span>
            </div>

            <Button
              className="mt-4 w-full rounded-full bg-rose-500 text-white"
              onClick={() => onCheckout?.({ location })}
              disabled={!cart.length}
            >
              Checkout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
