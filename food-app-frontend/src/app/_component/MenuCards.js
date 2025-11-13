"use client";
import Image from "next/image";
import { PenIcon } from "../_icons/Pen";

export const MenuCards = ({ onOpen, dish }) => {
  const imgSrc =
    dish?.image && dish.image.trim().length > 0 ? dish.image : "/User.jpg";
  return (
    <>
      <div className="w-[270px] h-[241px] cursor-pointer">
        <div className="w-[270px] h-[241px] rounded-2xl bg-white overflow-hidden flex flex-col border">
          <div className="w-[270px] h-[160px] px-3 relative ">
            <Image
              className="h-35 w-60 object-cover absolute rounded-lg inset-0 ml-3 mt-5"
              src={imgSrc}
              alt={dish.foodName}
              width={100}
              height={100}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen?.(dish);
              }}
              className="w-9 h-9 rounded-full absolute z-10 right-3 bottom-3 bg-white flex items-center justify-center shadow mr-4"
            >
              <PenIcon />
            </button>
          </div>
          <div className="w-full flex justify-between px-5 mt-2">
            <p className="text-red-400 font-medium text-sm truncate">
              {dish.foodName}
            </p>
            <p className="text-black text-sm">{dish.price} ₮</p>
          </div>
          <p className="text-black text-sm px-5 line-clamp-2">
            {dish.ingredients}
          </p>
        </div>
      </div>
    </>
  );
};
