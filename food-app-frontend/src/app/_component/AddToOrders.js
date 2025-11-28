"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { BiCart } from "react-icons/bi";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { CartSuccess } from "../_icons/CartSuccess";
import { CartEmptyIcon } from "../_icons/CartEmptyIcon";
import { AuthContext } from "../_context/authContext";

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

export default function AddToOrders({
  open,
  onOpenChange,
  cart = [],
  onInc,
  setCart,
  onDec,
  onRemove,
}) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState("");
  const [activeTab, setActiveTab] = useState("cart");
  const [orders, setOrders] = useState([]);

  const router = useRouter();
  const { token, user } = useContext(AuthContext);
  console.log("useruser", user);

  const loadOrders = async () => {
    if (typeof window === "undefined") return;
    if (!token || !user?._id || !open) {
      setOrders([]);
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/foodOrder", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to load orders", res.status);
        setOrders([]);
        return;
      }

      const all = await res.json();
      console.log("ALL ORDERS:", all);

      const mine = (Array.isArray(all) ? all : []).filter((o) => {
        const id = o.user && (o.user._id || o.user);
        return String(id) === String(user._id);
      });

      setOrders(mine);
    } catch (e) {
      console.error("Order fetch error", e);
      setOrders([]);
    }
  };
  useEffect(() => {
    loadOrders();
  }, [open, token, user?._id]);

  const itemsTotal = useMemo(
    () =>
      (cart || []).reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (it.qty || 1),
        0
      ),
    [cart]
  );

  const shipping = 6000;
  const grandTotal = useMemo(
    () => +(itemsTotal + shipping).toFixed(2),
    [itemsTotal, shipping]
  );

  useEffect(() => {
    if (user?.address && !location) {
      setLocation(user.address);
    }
  }, [user, location]);

  const checkout = async () => {
    if (!cart.length) return;

    if (!token || !user?._id) {
      setShowLoginDialog(true);
      return;
    }

    if (!location.trim()) {
      setLocationError("Please write your delivery address.");
      setActiveTab("cart");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/foodOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: user._id,
          totalPrice: grandTotal,
          foodOrderItems: cart.map((it) => ({
            food: it._id,
            quantity: it.qty || 1,
          })),
          deliveryAddress: location,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Create order failed", res.status, err);
        return;
      }

      setCart([]);
      localStorage.removeItem("cart_items");
      localStorage.setItem("cart_badge", "0");

      await loadOrders();

      setActiveTab("orders");
      setShowSuccessDialog(true);
    } catch (e) {
      console.error("Order create error:", e);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 border-0 bg-transparent ">
        <div className="flex bg-neutral-800 h-screen flex-col gap-5">
          <div className="rounded-2xl gap-6 flex flex-col ">
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <SheetTitle className="flex justify-center items-center gap-2 px-3 mt-5 text-white">
                <BiCart /> Order detail
              </SheetTitle>
              <button
                className="ml-auto grid h-8 w-8 place-items-cente r rounded-full border-gray-300 border text-gray-300 "
                onClick={() => onOpenChange?.(false)}
              >
                ×
              </button>
            </div>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
              <TabsList className=" w-full rounded-full ">
                <TabsTrigger value="cart" className="w-1/2 rounded-full ">
                  Cart
                </TabsTrigger>
                <TabsTrigger value="orders" className="w-1/2 rounded-full">
                  Orders
                </TabsTrigger>
              </TabsList>
              <TabsContent value="cart">
                <Card>
                  <div className="rounded-2xl bg-white h-full ">
                    <div className="p-5 bg-white rounded-lg h-full  overflow-y-auto">
                      <CardHeader>
                        <CardTitle className=" text-[20px] font-semibold text-neutral-500">
                          My cart
                        </CardTitle>
                      </CardHeader>
                      {!Array.isArray(cart) || cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 bg-gray-100 rounded-lg gap-2">
                          <CartEmptyIcon />
                          <p className="text-base font-semibold text-neutral-900">
                            Your cart is empty
                          </p>
                          <p className="mt-1 text-xs text-neutral-500 text-center max-w-xs">
                            Hungry? 🍔 Add some delicious dishes to your cart
                            and satisfy your cravings!
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-5 border-dashed ">
                            {cart.map((it, i) => (
                              <div
                                key={
                                  it.lineId ??
                                  (it._id ? `${it._id}-${i}` : `row-${i}`)
                                }
                                className="border-dashed border-b pb-4"
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
                                        {(
                                          (Number(it.price) || 0) *
                                          (it.qty || 1)
                                        ).toFixed(2)}{" "}
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
                            <textarea
                              className={`w-full h-20 rounded-lg border px-3 py-3 outline-none ${
                                locationError
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Please complete your address"
                              value={location}
                              onChange={(e) => {
                                setLocation(e.target.value);
                                if (locationError) setLocationError("");
                              }}
                            />
                            {locationError && (
                              <p className="text-l text-red-500">
                                {locationError}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="orders">
                <Card>
                  <div className="rounded-2xl bg-white h-full">
                    <div className="p-5 bg-white rounded-lg h-full overflow-y-auto">
                      <CardHeader>
                        <CardTitle className="text-[20px] font-semibold text-neutral-900">
                          Order history
                        </CardTitle>
                      </CardHeader>

                      {orders.length === 0 ? (
                        <div className="mt-4 rounded-2xl bg-neutral-100 px-6 py-8 flex flex-col items-center gap-3 text-center">
                          <div className="mb-1">
                            <CartEmptyIcon />
                          </div>
                          <p className="text-base font-semibold text-neutral-900">
                            No Orders Yet?
                          </p>
                          <p className="max-w-md text-xs text-neutral-500">
                            🍕 &quot;You haven't placed any orders yet. Start
                            exploring our menu and satisfy your cravings!&quot;
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((ord, index) => {
                            const price = Number(ord.totalPrice) || 0;
                            const shortId =
                              typeof ord._id === "string"
                                ? ord._id.slice(-5)
                                : typeof ord.id === "string"
                                ? ord.id.slice(-5)
                                : "";

                            const foods = Array.isArray(ord.foodOrderItems)
                              ? ord.foodOrderItems
                              : [];

                            const address =
                              ord.deliveryAddress ||
                              ord.user?.address ||
                              "No address";

                            const status = ord.status || "PENDING";
                            const statusClasses =
                              status === "DELIVERED"
                                ? "border-0 bg-neutral-100 text-neutral-900"
                                : status === "CANCELLED"
                                ? "border-red-300 text-red-500 bg-red-50"
                                : "border-red-300 text-red-500 bg-white";

                            return (
                              <div
                                key={String(ord._id ?? ord.id ?? index)}
                                className="rounded-2xl bg-white"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1">
                                    <p className="text-xl font-semibold text-neutral-900">
                                      {price.toFixed(2)} ₮{" "}
                                      {shortId && (
                                        <span className="text-sm text-neutral-500">
                                          (#{shortId})
                                        </span>
                                      )}
                                    </p>
                                  </div>

                                  <span
                                    className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-medium ${statusClasses}`}
                                  >
                                    {status.charAt(0) +
                                      status.slice(1).toLowerCase()}
                                  </span>
                                </div>

                                <div className="mt-3 space-y-2 text-sm text-neutral-600">
                                  {foods.map((it, i) => {
                                    const name =
                                      it.food?.foodName ??
                                      it.foodName ??
                                      "Food item";
                                    const qty = it.qty || it.quantity || 1;
                                    return (
                                      <div
                                        key={String(it._id ?? it.food ?? i)}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span aria-hidden>🍽️</span>
                                          <span>{name}</span>
                                        </div>
                                        <span className="text-xs text-neutral-500">
                                          x {qty}
                                        </span>
                                      </div>
                                    );
                                  })}

                                  {foods.length === 0 && (
                                    <p className="text-xs text-neutral-400">
                                      No items.
                                    </p>
                                  )}

                                  <div className="flex items-center gap-2 pt-2">
                                    <span aria-hidden>⏱</span>
                                    <span>{formatDate(ord.createdAt)}</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span aria-hidden>📍</span>
                                    <span className="truncate">{address}</span>
                                  </div>
                                </div>

                                <div className="mt-4 border-t border-dashed" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
            {activeTab === "cart" && (
              <div className="rounded-2xl border p-5 bg-white">
                <p className="mb-3 text-[18px] font-medium text-neutral-600">
                  Payment info
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span>Items</span>
                  <span className="font-semibold">
                    {itemsTotal.toFixed(2)} ₮
                  </span>
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
                <SheetFooter>
                  <Button
                    className="mt-4 w-full rounded-full bg-rose-500 text-white"
                    onClick={checkout}
                    disabled={!cart.length}
                  >
                    Checkout
                  </Button>
                </SheetFooter>
              </div>
            )}
          </div>
        </div>
      </SheetContent>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              You need to log in first
            </DialogTitle>
          </DialogHeader>
          <div className="mt-10 flex gap-5">
            <Button
              className="flex-1 h-11 rounded-lg bg-black text-white"
              onClick={() => {
                router.push("/login");
                setShowLoginDialog(false);
              }}
            >
              Log in
            </Button>
            <Button
              className="flex-1 h-11 rounded-lg text-black bg-neutral-100"
              onClick={() => {
                router.push("/signup");
                setShowLoginDialog(false);
              }}
            >
              Sign up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Your order has been successfully placed !
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 flex flex-col items-center gap-4">
            <CartSuccess />
            <Button
              className="flex-1 mt-2 h-18 w-[180px] rounded-full bg-neutral-100 text-black text-sm font-medium"
              onClick={() => {
                setShowSuccessDialog(false);
                router.push("/");
              }}
            >
              Back to home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
