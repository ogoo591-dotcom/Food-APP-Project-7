"use client";

import { useEffect } from "react";

export const OrderHistory = ({ orders = [] }) => {
  useEffect(() => {
    const fetchOrders = async () => {
      const email = localStorage.getItem("user_email");
      if (!email) return;

      const res = await fetch(
        `http://localhost:4000/foodOrder?email=${encodeURIComponent(email)}`
      );
      const json = await res.json();
      setOrders(json);
    };

    fetchOrders();
  }, []);

  if (!orders.length) {
    return (
      <div className="rounded-2xl bg-white p-5">
        <p className="text-lg font-semibold text-neutral-900">Order history</p>
        <p className="mt-3 text-sm text-neutral-500">
          You don’t have any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5">
      <p className="text-lg font-semibold text-neutral-900">Order history</p>

      <div className="mt-4 space-y-6">
        {orders.map((order) => {
          const statusColor =
            order.status === "Pending"
              ? "border-red-400 text-red-500 bg-red-50"
              : "border-transparent text-neutral-700 bg-neutral-100";

          return (
            <div key={order.id} className="rounded-2xl bg-white">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-neutral-900">
                    ${order.total.toFixed(2)}{" "}
                    <span className="text-sm text-neutral-500">
                      (#{order.id})
                    </span>
                  </p>
                </div>

                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusColor}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-sm text-neutral-500">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🍽️</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-xs text-neutral-600">
                      x {item.qty}
                    </span>
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-2">
                  <span>⏱</span>
                  <span>{order.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="truncate">{order.address}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-dashed" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
