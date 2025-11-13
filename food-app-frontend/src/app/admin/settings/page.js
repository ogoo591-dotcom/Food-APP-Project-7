"use client";
import { CarIcon } from "lucide-react";
import { FoodIcon } from "../../_icons/FoodMenu";
import { Logo3Icon } from "../../_icons/Logo3";
import { SettingIcon } from "../../_icons/Setting";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-[1440px] h-[1024px] m-auto bg-gray-100 flex flex-wrap  mt-10 gap-3">
      <div className="h-[1024px] w-[204px] bg-white gap-10 py-9 flex flex-col">
        <Logo3Icon />
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
      <div className="w-[1171px] h-[948px] mt-10 bg-white">
        <img className="w-9 h-9 rounded-full ml-280" src="../User.jpg" />
      </div>
      <div></div>
    </div>
  );
}
