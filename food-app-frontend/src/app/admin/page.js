"use client";

import { CarIcon } from "lucide-react";
import { Logo3Icon } from "../_icons/Logo3";
import { SettingIcon } from "../_icons/Setting";
import Link from "next/link";
import { FoodIcon2 } from "../_icons/FoodMenu2";
import CategoryCards from "../_features/CategoryCards";
import { useEffect, useState } from "react";
import { FoodsByCategory } from "../_features/FoodsByCategory";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  const categoryData = async () => {
    const data = await fetch("http://localhost:4000/foodCategory");
    const jsonData = await data.json();
    setCategories(jsonData);
  };

  useEffect(() => {
    categoryData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) router.push("/login");
    }
  }, []);

  return (
    <div className="w-[1440px] h-screen m-auto bg-gray-100 flex mt-10 gap-8 relative">
      <div className="h-full w-[250px] bg-white gap-10 py-9 flex flex-col px-5 ">
        <button
          onClick={() => router.push("/")}
          aria-label="Go home"
          className="shrink-0"
        >
          <Logo3Icon />
        </button>
        <Link
          href={"/admin"}
          className="flex justify-center items-center gap-2 h-10 w-40 bg-black text-white rounded-full"
        >
          <FoodIcon2 />
          <p>Food menu</p>
        </Link>
        <Link
          href={"admin/orders"}
          className="flex justify-center items-center gap-2 h-10 w-40 hover:bg-black hover:text-white rounded-full"
        >
          <CarIcon />
          Orders
        </Link>
        <Link
          href={"admin/settings"}
          className="flex justify-center items-center gap-2 h-10 w-40 hover:bg-black hover:text-white rounded-full hover:ml-2"
        >
          <SettingIcon />
          <p>Settings</p>
        </Link>
      </div>
      <div className="w-[1170px] h-auto flex flex-col gap-5  overflow-auto">
        <img className="w-9 h-9 rounded-full ml-280 mt-5" src="./User.jpg" />
        <CategoryCards categories={categories} categoryData={categoryData} />
        {categories.map((category) => (
          <FoodsByCategory
            key={category._id}
            categoryId={category._id}
            categoryName={category.categoryName}
          />
        ))}
      </div>
    </div>
  );
}
