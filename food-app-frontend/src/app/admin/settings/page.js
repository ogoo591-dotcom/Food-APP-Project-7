"use client";
import { CarIcon } from "lucide-react";
import { FoodIcon } from "../../_icons/FoodMenu";
import { Logo3Icon } from "../../_icons/Logo3";
import { SettingIcon } from "../../_icons/Setting";
import { useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneVolume } from "react-icons/fa6";
import { MdMarkEmailUnread } from "react-icons/md";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../_context/authContext";

export default function Home() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const avatarText = (user?.email || "U").charAt(0).toUpperCase();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, router]);
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
        <button
          onClick={() => router.push("/admin/orders")}
          aria-label="Go orders"
          className="flex justify-center items-center gap-2 h-10 w-40 hover:bg-black hover:text-white rounded-full"
        >
          <CarIcon />
          Orders
        </button>
        <div className="flex justify-center items-center gap-2 h-10 w-40 bg-black text-white rounded-full hover:ml-2">
          <SettingIcon />
          <p>Settings</p>
        </div>
      </div>
      <div className="w-[1171px] h-[948px]  ">
        <div className="ml-280 mt-5 mb-5 h-9 w-9 rounded-full bg-neutral-200 text-neutral-700 grid place-items-center text-sm font-semibold">
          {avatarText}
        </div>
        <div className="w-[1171px] h-[850px] p-10 gap-5 flex flex-col bg-white border rounded-xl">
          <h1 className="font-bold text-xl">Холбоо барих</h1>
          <div className="flex gap-3">
            <FaLocationDot />
            <div className="w-100 flex gap-2">
              <h1 className="font-bold text-bold text-lg">Хаяг:</h1>
              Улаанбаатар, Сүхбаатар дүүрэг, 1-р хороо, Нарны зам, Үндэсний соёл
              амралтын хүрээлэн, 36б тоот, NomNom ХХК төв оффис
            </div>
          </div>{" "}
          <div className="flex gap-3">
            <FaPhoneVolume />
            <span className="w-100 flex items-center gap-2 ">
              <h1 className="font-bold text-bold text-lg">Утас:</h1> 7705 1616
            </span>
          </div>
          <div className="flex gap-3">
            <MdMarkEmailUnread />
            <span className="w-100 flex items-center gap-2 ">
              <h1 className="font-bold text-bold text-lg">И-мэйл:</h1>
              support@nomnom.mn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
