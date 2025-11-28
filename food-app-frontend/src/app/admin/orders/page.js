"use client";
import { CarIcon } from "lucide-react";
import { OrderCards } from "../../_component/OrderCards";
import { CancelledIcon } from "../../_icons/Cancelled";
import { Logo3Icon } from "../../_icons/Logo3";
import { SettingIcon } from "../../_icons/Setting";
import { FoodIcon } from "@/app/_icons/FoodMenu";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ZuunIcon } from "@/app/_icons/ZuunIcon";
import { BaruunIcon } from "@/app/_icons/BaruunIcon";

const STATUS_PILLS = ["PENDING", "CANCELLED", "DELIVERED"];
const backend_url = process.env.PUBLIC_BACKEND_URL;

export default function Home() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [order, setOrder] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("Delivered");
  const pageSize = 10;

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const orderData = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${backend_url}/foodOrder`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        console.error("Failed to load orders:", res.status);
        setOrder([]);
        return;
      }

      const jsonData = await res.json();
      console.log("ADMIN ORDERS:", jsonData);
      const sorted = (Array.isArray(jsonData) ? jsonData : []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrder(Array.isArray(jsonData) ? jsonData : []);
    } catch (e) {
      console.error("Order fetch error:", e);
      setOrder([]);
    }
  };

  useEffect(() => {
    orderData();
  }, []);

  useEffect(() => {
    if (!order.length) {
      setFromDate("");
      setToDate("");
      return;
    }

    const dates = order
      .map((o) => o.createdAt)
      .filter(Boolean)
      .map((d) => new Date(d));

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const toInput = (d) => d.toISOString().slice(0, 10);

    setFromDate(toInput(minDate));
    setToDate(toInput(maxDate));
  }, [order]);

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(order)) return [];

    if (!fromDate && !toDate) {
      return order;
    }

    const fromTs = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
    const toTs = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;

    return order.filter((o) => {
      if (!o.createdAt) return false;

      const t = new Date(o.createdAt).getTime();
      if (Number.isNaN(t)) return false;

      if (fromTs !== null && t < fromTs) return false;
      if (toTs !== null && t > toTs) return false;

      return true;
    });
  }, [order, fromDate, toDate]);

  useEffect(() => {
    const tp = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
    setTotalPages(tp);
    if (page > tp) setPage(tp);
  }, [filteredOrders, page]);

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${backend_url}/foodOrder/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Update status failed:", res.status, err);
        return;
      }

      setOrder((prev) =>
        prev.map((o) =>
          String(o._id) === String(id) ? { ...o, status: newStatus } : o
        )
      );
    } catch (e) {
      console.error("Update status error:", e);
    }
  };

  const handleRowStatus = (newStatus, id) => {
    updateOrderStatus(id, newStatus);
  };

  const toggleOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const allIds = useMemo(() => order.map((o) => o._id), [order]);
  const allChecked =
    selectedIds.length > 0 && selectedIds.length === allIds.length;

  const toggleAll = () =>
    setSelectedIds((prev) => (prev.length === allIds.length ? [] : allIds));

  const handleSaveStatus = async () => {
    await Promise.all(selectedIds.map((id) => updateOrderStatus(id, status)));

    setSelectedIds([]);
    setShowModal(false);
  };

  const paginatedOrders = useMemo(
    () => filteredOrders.slice((page - 1) * pageSize, page * pageSize),
    [filteredOrders, page]
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };
  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));
  const handlePageClick = (page) => setPage(page);

  const getId = (o) => String(o._id ?? o.id);
  const count = selectedIds.length;
  const canChange = count > 0;

  return (
    <div className="w-[1440px] h-[1024px] m-auto bg-gray-100 flex flex-wrap  mt-10 gap-3">
      <div className="h-[1024px] w-[204px] bg-white gap-10 py-9 flex flex-col">
        <button
          onClick={() => router.push("/")}
          aria-label="Go home"
          className="shrink-0"
        >
          <Logo3Icon />
        </button>
        <button
          onClick={() => router.push("/admin")}
          aria-label="Go home"
          className="flex justify-center items-center gap-2 h-10 w-40 hover:bg-black hover:text-white rounded-full"
        >
          <FoodIcon />
          <p>Food menu</p>
        </button>
        <div className="flex justify-center items-center gap-2 h-10 w-40 bg-black text-white rounded-full">
          <CarIcon />
          Orders
        </div>
        <button
          onClick={() => router.push("/admin/settings")}
          aria-label="Go settings"
          className="flex justify-center items-center gap-2 h-10 w-40 hover:bg-black hover:text-white rounded-full hover:ml-2"
        >
          <SettingIcon />
          <p>Settings</p>
        </button>
      </div>
      <div className="w-[1171px] h-[948px]  ">
        <img
          className="w-9 h-9 rounded-full mt-5 mb-5 ml-280"
          src="../User.jpg"
        />
        <div className="w-[1171px] h-[850px]  bg-white border rounded-xl">
          <div className="w-full h-[60px] flex  items-center px-5 bg-white gap-10 text-sm  ">
            <div className="flex flex-col ml-15 w-100 justify-center">
              <h2 className="font-bold text-xl">Orders</h2>
              <p className="text-l">{order.length} items</p>
            </div>

            <div className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2 bg-white text-[12px]">
              <input
                type="date"
                name="date_from"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-transparent text-neutral-900 focus:outline-none
                           [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
              <span className="text-neutral-400">-</span>
              <input
                type="date"
                name="date_to"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-transparent text-neutral-900 focus:outline-none
                          [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>

            <button
              disabled={!canChange}
              onClick={() => setShowModal(true)}
              className={[
                "w-60 h-9 flex justify-center items-center gap-3 px-4 font-medium rounded-full transition",
                canChange
                  ? "bg-black text-white"
                  : "bg-gray-300 text-white cursor-not-allowed",
              ].join(" ")}
            >
              <span className="text-sm">Change delivery state</span>
              {canChange && (
                <span className="h-6 min-w-7 px-2 bg-white rounded-full text-black text-sm flex justify-center items-center">
                  {count}
                </span>
              )}
            </button>
          </div>

          <div className="w-full h-[60px] flex  items-center bg-gray-100 gap-10  ">
            <input
              className="ml-17"
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
            />
            <p>№</p>
            <p className="w-28">Customer</p>
            <div className="flex gap-10 justify-center items-center w-30">
              <h2>Food</h2>
              <CancelledIcon />
            </div>
            <div className="w-20">Date</div>
            <p className="w-13">Total</p>
            <h1 className="w-50 truncate">Delivery Address</h1>
            <button className="w-45 h-8 flex justify-center items-center gap-5 p-4 font-medium">
              <h1>Delivery state</h1>
              <CancelledIcon />
            </button>
          </div>
          {paginatedOrders.map((ord, index) => (
            <OrderCards
              key={getId(ord)}
              id={getId(ord)}
              index={(page - 1) * pageSize + index + 1}
              customer={ord.user}
              foods={ord.foodOrderItems}
              date={ord.createdAt}
              total={ord.totalPrice}
              status={ord.status || "PENDING"}
              checked={selectedIds.includes(getId(ord))}
              onToggle={() => toggleOne(getId(ord))}
              onChangeStatus={handleRowStatus}
              address={ord.deliveryAddress}
            />
          ))}
        </div>
        <div className=" flex flex-row justify-end items-center gap-2 mt-5">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="flex justify-center items-center gap-2 px-2 py-1 rounded disabled:opacity-50 cursor-pointer"
          >
            <ZuunIcon />
          </button>

          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={`page-${p}`}
                onClick={() => handlePageClick(p)}
                className={` ${
                  page === p
                    ? "h-9 w-9 flex justify-center items-center border rounded-full bg-white cursor-pointer hover:bg-gray-500"
                    : "h-9 w-9  rounded-full cursor-pointer hover:bg-gray-500"
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="flex justify-center items-center gap-2 px-2 py-1 rounded disabled:opacity-50 cursor-pointer"
          >
            <BaruunIcon />
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between">
              <h3 className="text-xl font-semibold">Change delivery state</h3>
              <button
                onClick={() => setShowModal(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-xl"
              >
                ×
              </button>
            </div>

            <div className="mb-8 flex flex-wrap gap-6 justify-center">
              {STATUS_PILLS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setStatus(p)}
                  className={[
                    "rounded-full border px-5 py-2 text-[13px] font-medium transition",
                    status === p
                      ? "border-red-400 text-red-500 bg-red-100"
                      : "border-none text-neutral-800 bg-neutral-200 hover:border-neutral-300",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveStatus}
              className="w-full rounded-full bg-neutral-900 py-2 text-center text-white text-[18px] font-medium hover:opacity-90"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
