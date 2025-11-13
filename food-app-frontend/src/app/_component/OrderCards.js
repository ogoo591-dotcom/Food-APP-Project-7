"use client";
import { useState } from "react";
import { CancelledIcon } from "../_icons/Cancelled";
import OrderDetails from "./OrderDetails";

export const OrderCards = (props) => {
  const {
    id,
    index,
    customer,
    foods,
    date,
    total,
    checked,
    onToggle,
    status = "Pending",
    onChangeStatus,
  } = props;

  const [open, setOpen] = useState(false);

  const statusBorder =
    {
      Delivered: "border-green-400",
      Pending: "border-red-400",
      Cancelled: "border-neutral-300",
    }[status] || "border-neutral-200";

  return (
    <div className="w-full h-[60px] flex justify-center items-center bg-white hover:bg-gray-100 gap-10 text-sm">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <p className="w-5"> {index}</p>
      <p className="w-30">{customer?.email || "—"}</p>
      <div className="flex items-center gap-2">
        <OrderDetails foodId={id} count={foods?.length || 0} />
      </div>
      <div className="w-20">{new Date(date).toISOString().slice(0, 10)}</div>
      <p className="w-15">{total?.toFixed?.(0) ?? total} ₮</p>
      <h1 className="w-55 truncate">{customer?.address || "—"}</h1>
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
          className={`flex items-center rounded-full px-3 py-2 gap-2 w-33 justify-center font-medium border ${statusBorder} bg-white hover:bg-neutral-50`}
        >
          {status}
          <CancelledIcon />
        </button>

        {open && (
          <div className="absolute left-0 z-50 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl">
            {["Delivered", "Pending", "Cancelled"].map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChangeStatus?.(opt, id);
                  setOpen(false);
                }}
                className="w-full text-left mb-2 last:mb-0 rounded-full border border-neutral-200 px-4 py-2 hover:border-neutral-300 hover:bg-neutral-50"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
