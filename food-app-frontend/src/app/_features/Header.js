"use client";

import { useRouter } from "next/navigation";
import { LocationIcon } from "../_icons/Location";
import { LogoIcon } from "../_icons/Logo";
import { NextIcon } from "../_icons/Next";
import { UserIcon } from "../_icons/User";
import LocationHere from "../_component/LocationHere";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import AddToOrders from "../_component/AddToOrders";

export const Header = () => {
  const router = useRouter();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const [cart, setCart] = useState([]);
  const [badge, setBadge] = useState(0);
  const [address, setAddress] = useState("");

  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncAuth = () => {
      const token = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("user_email");
      setIsLoggedIn(!!token && !!storedEmail);
      setEmail(storedEmail || "");
    };

    syncAuth();
    setMounted(true);
    window.addEventListener("auth:changed", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth:changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);
  const clearAddress = () => {
    setAddress("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("delivery_address");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedItems = localStorage.getItem("cart_items");
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems);
        setCart(parsed);
        const totalQty = parsed.reduce((s, x) => s + (x.qty || 1), 0);
        setBadge(totalQty);
      } catch {
        setCart([]);
        setBadge(0);
      }
    } else {
      setCart([]);
      setBadge(0);
    }

    const cached = localStorage.getItem("delivery_address") || "";
    setAddress(cached);

    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("user_email");
    if (token && storedEmail) {
      setIsLoggedIn(true);
      setEmail(storedEmail);
    } else {
      setIsLoggedIn(false);
      setEmail("");
    }

    const handleAdd = (e) => {
      const { dish, qty = 1 } = e.detail || {};
      if (!dish?._id) return;

      setCart((prev) => {
        const i = prev.findIndex((x) => x._id === dish._id);
        let next;
        if (i >= 0) {
          next = [...prev];
          next[i] = { ...next[i], qty: (next[i].qty || 1) + qty };
        } else {
          next = [...prev, { ...dish, qty }];
        }

        localStorage.setItem("cart_items", JSON.stringify(next));

        const total = next.reduce((s, x) => s + (x.qty || 1), 0);
        setBadge(total);
        localStorage.setItem("cart_badge", String(total));

        return next;
      });
    };

    window.addEventListener("cart:add", handleAdd);
    return () => window.removeEventListener("cart:add", handleAdd);
  }, []);

  useEffect(() => {
    const total = cart.reduce((s, x) => s + (x.qty || 1), 0);
    setBadge(total);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart_badge", String(total));
    }
  }, [cart]);

  const inc = (id) =>
    setCart((p) => {
      const next = p.map((x) =>
        x._id === id ? { ...x, qty: (x.qty || 1) + 1 } : x
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("cart_items", JSON.stringify(next));
      }
      return next;
    });

  const dec = (id) =>
    setCart((p) => {
      const next = p.map((x) =>
        x._id === id ? { ...x, qty: Math.max(1, (x.qty || 1) - 1) } : x
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("cart_items", JSON.stringify(next));
      }
      return next;
    });

  const removeOne = (id) =>
    setCart((p) => {
      const next = p.filter((x) => x._id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("cart_items", JSON.stringify(next));
      }
      return next;
    });

  const checkout = ({ location }) => {
    console.log("checkout:", { cart, location });
    setCart([]);
    setBadge(0);
    localStorage.removeItem("cart_items");
    localStorage.setItem("cart_badge", "0");
    setCartOpen(false);
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("delivery_address");
    }

    setIsLoggedIn(false);
    setEmail("");
    setUserMenuOpen(false);
    setAddress?.("");
    router.push("/login");
  };

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
          onSaved={(value) => {
            setAddress(value);
            localStorage.setItem("delivery_address", value);
          }}
          saveToServer={false}
          userId={undefined}
        />

        <button
          className="relative"
          aria-label="Open cart"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingCart className="h-6 w-6 text-white" />
          {badge > 0 && (
            <span
              className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full
                           bg-rose-500 text-white text-xs grid place-items-center"
            >
              {badge}
            </span>
          )}
        </button>
        <AddToOrders
          open={cartOpen}
          onOpenChange={setCartOpen}
          cart={cart}
          setCart={setCart}
          onInc={inc}
          onDec={dec}
          onRemove={removeOne}
          onCheckout={checkout}
          initialLocation={address}
          onLocationChange={(value) => {
            setAddress(value);
            if (typeof window !== "undefined") {
              localStorage.setItem("delivery_address", value);
            }
          }}
          onCheckoutSuccess={clearAddress}
        />
        {mounted &&
          (isLoggedIn ? (
            <>
              <button
                className="w-9 h-9 bg-red-500 hover:bg-red-600 flex justify-center items-center rounded-full"
                onClick={() => setUserMenuOpen((v) => !v)}
              >
                <UserIcon />
              </button>

              {userMenuOpen && (
                <div className="w-[188px] h-[104px] bg-gray-100 rounded-2xl text-base flex justify-center items-center flex-col gap-2 font-bold absolute top-12 right-0 shadow-lg">
                  <span>{email || "Guest"}</span>
                  <button
                    className="w-24 h-9 bg-gray-200 rounded-full text-sm font-medium"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              className="px-4 h-9 bg-white text-black text-sm font-medium rounded-full border border-neutral-300"
              onClick={() => router.push("/login")}
            >
              Log in
            </button>
          ))}
      </div>
    </div>
  );
};
