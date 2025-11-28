"use client";
import { useState } from "react";
import { CancelledIcon } from "../_icons/Cancelled";
import OrderDetails from "./OrderDetails";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];
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
    status = "PENDING",
    onChangeStatus,
    address,
  } = props;

  const [open, setOpen] = useState(false);

  const email =
    typeof customer === "string" ? customer : customer?.email ?? "—";

  const statusLabel =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const statusBorder =
    {
      DELIVERED: "border-green-400",
      PENDING: "border-red-400",
      CANCELLED: "border-neutral-300",
    }[status] || "border-neutral-200";

  const handleSelectStatus = (newStatus) => {
    onChangeStatus?.(newStatus, id);
    setOpen(false);
  };

  return (
    <div className="w-full h-[60px] flex justify-center items-center bg-white hover:bg-gray-100 gap-10 text-sm">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <p className="w-5"> {index}</p>
      <p className="w-30">{email || "—"}</p>
      <div className="flex items-center gap-2">
        <OrderDetails foodId={id} count={foods?.length || 0} />
      </div>
      <div className="w-20">{new Date(date).toISOString().slice(0, 10)}</div>
      <p className="w-15">{total?.toFixed?.(0) ?? total} ₮</p>
      <h1 className="w-55 truncate"> {address || customer?.address || "—"}</h1>
      <div
        className="relative"
        tabIndex={-1}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center rounded-full px-3 py-2 gap-2 w-30 justify-center font-medium border ${statusBorder} bg-white hover:bg-neutral-50`}
        >
          {statusLabel}
          <CancelledIcon />
        </button>

        {open && (
          <div className="absolute left-0 z-50 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl">
            {["PENDING", "DELIVERED", "CANCELLED"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectStatus(opt)}
                className="w-full text-left mb-2 last:mb-0 rounded-full border border-neutral-200 px-4 py-2 hover:border-neutral-300 hover:bg-neutral-50"
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
