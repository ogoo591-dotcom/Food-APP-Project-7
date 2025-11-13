"use client";
import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
// import { useCart } from "@/lib/cart-store";

export const FoodCards = ({ dish, isSelected }) => {
  // const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const price = Number(dish?.price) || 0;
  const total = (price * qty).toFixed(2);

  const imgSrc =
    dish?.image && dish.image.trim().length > 0 ? dish.image : "/User.jpg";

  return (
    <>
      <div className="w-[398px] h-[342px] cursor-pointer">
        <div className="w-full h-full rounded-2xl bg-white overflow-hidden flex flex-col border">
          <div className="w-full h-[230px] px-3 relative ">
            <Image
              className="h-50 w-92 object-cover absolute rounded-lg inset-0 ml-3 mt-5"
              src={imgSrc}
              alt={dish.foodName}
              width={100}
              height={100}
            />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={[
                    "absolute right-6  h-14 w-14 rounded-full grid place-items-center shadow-lg",
                    isSelected
                      ? "bg-black text-white"
                      : "bg-white text-red-500",
                  ].join(" ")}
                  aria-label={isSelected ? "Selected" : "Add"}
                  onClick={() => setOpen(false)}
                >
                  {isSelected ? <Check size={22} /> : <Plus size={22} />}
                </Button>
              </DialogTrigger>
              <DialogContent className="p-4 rounded-2xl">
                <div className="grid grid-cols-[1fr_1.1fr] gap-6 h-70">
                  <div className="relative">
                    <Image
                      src={dish?.image || "/placeholder.png"}
                      alt={dish?.foodName || "dish"}
                      className="h-66 w-full object-cover rounded-xl"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="flex flex-col">
                    <DialogHeader className="space-y-2">
                      <DialogTitle className="text-[22px] leading-8 text-rose-500 mt-5">
                        {dish?.foodName}
                      </DialogTitle>
                      <DialogDescription className="text-[15px] text-neutral-700">
                        {dish?.ingredients}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-20 flex items-center justify-between gap-5">
                      <div>
                        <p className="text-sm text-black">Total price</p>
                        <p className=" text-xl font-semibold">{total} ₮</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="grid h-8 w-8 place-items-center rounded-full border border-neutral-200"
                        >
                          –
                        </button>
                        <span className="min-w-4 text-l"> {qty} </span>
                        <button
                          onClick={() => setQty((q) => q + 1)}
                          className="grid h-8 w-8 place-items-center rounded-full border border-neutral-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => {
                        add(dish, qty);
                        setQty(1);
                      }}
                      className="w-full rounded-full bg-neutral-900 text-white hover:opacity-90"
                    >
                      Add to cart
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-full flex justify-between px-5 mt-2">
            <p className="text-red-400 font-bold text-l truncate">
              {dish.foodName}
            </p>
            <p className="text-black text-l font-medium">{dish.price} ₮</p>
          </div>
          <p className="text-black text-l px-5 line-clamp-2">
            {dish.ingredients}
          </p>
        </div>
      </div>
    </>
  );
};
