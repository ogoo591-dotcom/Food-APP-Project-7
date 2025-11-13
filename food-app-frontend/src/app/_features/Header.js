"use client";

import { useRouter } from "next/navigation";
import { LocationIcon } from "../_icons/Location";
import { LogoIcon } from "../_icons/Logo";
import { NextIcon } from "../_icons/Next";
import { UserIcon } from "../_icons/User";
import LocationHere from "../_component/LocationHere";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import AddToCards from "../_component/AddToCards";
import { useCart } from "@/lib/cart-store";

export const Header = ({ dish }) => {
  const { open, setOpen, items, count, inc, dec, remove, clear } = useCart();
  const [pickerOpen, setPickerOpen] = useState(false);

  const [address, setAddress] = useState("");
  const router = useRouter();

  useEffect(() => {
    const cached = localStorage.getItem("delivery_address") || "";
    setAddress(cached);
  }, []);

  const truncate = (s, n = 28) => (s.length > n ? s.slice(0, n) + "…" : s);

  return (
    <div className="w-full h-[68px] bg-black justify-between items-center px-4 flex gap-4 mx-auto  sticky top-0 z-40">
      <button
        onClick={() => router.push("/admin")}
        aria-label="Go home"
        className="shrink-0 w-12 h-9 ml-22"
      >
        <LogoIcon />
      </button>
      <div className="flex justify-center items-center mr-15 gap-3">
        <button
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm hover:border-neutral-300"
        >
          <LocationIcon />
          <span className="text-red-400">
            Delivery address:
            <span className="ml-1 text-neutral-500">
              {address ? truncate(address) : "Add Location"}
            </span>
          </span>
          <NextIcon />
        </button>
        <LocationHere
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSaved={(value) => setAddress(value)}
          saveToServer={false}
          userId={undefined}
        />
        <button
          onClick={() => setOpen(true)}
          className="relative"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-6 w-6 text-white" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-xs grid place-items-center">
              {count}
            </span>
          )}
        </button>

        <AddToCards
          open={open}
          onOpenChange={setOpen}
          cart={items}
          onInc={inc}
          onDec={dec}
          onRemove={remove}
          onCheckout={({ location }) => {
            clear();
            setOpen(false);
          }}
        />
        <button className="w-9 h-9 bg-red-500 hover:bg-transparent flex justify-center items-center rounded-full">
          <UserIcon />
        </button>
        <div className="w-[188px] h-[104px] bg-gray-100 rounded-2xl text-xl flex justify-center items-center flex-col gap-2 font-bold absolute mt-38 ml-65">
          Test@gmail.com
          <button className="w-20 h-9 bg-gray-200 rounded-4xl text-sm font-medium">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
