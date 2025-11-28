"use client";
import { useEffect, useState } from "react";

const backend_url = process.env.PUBLIC_BACKEND_URL;

export default function LocationHere({
  open,
  onClose,
  onSaved,
  saveToServer = false,
  userId,
}) {
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (open) {
      const cached = localStorage.getItem("delivery_address") || "";
      setAddress(cached);
    }
  }, [open]);

  const handleSave = async () => {
    const value = address.trim();
    if (!value) return;

    onSaved?.(value);
    localStorage.setItem("delivery_address", value);
    if (saveToServer && userId) {
      try {
        await fetch(`${backend_url}/user/${userId}/address`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: value }),
        });
      } catch (e) {
        console.error("Failed to save address to server:", e);
      }
    }
    onClose?.();
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="fixed left-1/3 bottom-1/2 z-50 w-[500px] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-2xl font-semibold text-neutral-900">
            Please write your delivery address!
          </h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-xl"
          >
            ×
          </button>
        </div>

        <label className="block text-sm text-neutral-600">
          <span className="sr-only">Address</span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Please share your complete address"
            className="mt-2 h-20 w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-400"
          />
        </label>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-neutral-900 px-5 py-2.5 text-white hover:opacity-90"
          >
            Deliver Here
          </button>
        </div>
      </div>
    </>
  );
}
