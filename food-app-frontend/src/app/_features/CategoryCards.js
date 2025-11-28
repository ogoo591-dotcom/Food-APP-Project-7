"use client";
import { useEffect, useState } from "react";
import { CategoryList } from "../_component/CategoryList";
import { toast } from "sonner";

const backend_url = process.env.PUBLIC_BACKEND_URL;

export default function CategoryCards({ categories, categoryData }) {
  const [items, setItems] = useState(categories || categoryData || []);
  const [categoryName, setCategoryName] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  const handleAddCategory = async () => {
    try {
      const res = await fetch(`${backend_url}/foodCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ categoryName: categoryName }),
      });
      categoryData();
      setCategoryName("");
      setShowForm(false);

      toast("New Category is being added to the menu", {
        position: "top-center",
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <section className="rounded-[18px] bg-gray-50 p-5 sticky top-0 z-40">
      <h3 className="mb-4 text-xl font-semibold text-neutral-900">
        Dishes category
      </h3>
      <div className="flex flex-wrap items-center gap-4">
        {items.map((cat) => (
          <CategoryList
            key={cat?._id}
            categoryName={cat?.categoryName}
            foodCount={cat?.food ?? cat?.foodsCount ?? 0}
          />
        ))}
        <div className="space-y-4">
          <button
            aria-label="Add category"
            className="grid h-10 w-10 place-items-center rounded-full bg-rose-500 text-white shadow-sm transition hover:scale-105 active:scale-95"
            onClick={() => setShowForm(true)}
          >
            +
          </button>
        </div>
      </div>
      {showForm && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setShowForm(false)}
          />
          <div className="w-115 h-70 bg-white rounded-2xl flex-col justify-center flex p-5 gap-8 fixed z-50 ml-45 mt-40  ">
            <div className="flex justify-between text-black ">
              <h1 className="font-bold">Add new category</h1>
              <button
                className="h-10 w-10 bg-gray-100 rounded-full text-xl"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div>
              <h1 className="font-medium">Category name</h1>
              <input
                className="border w-100 h-10 mt-1 rounded-md px-3 outline-none"
                placeholder="Type category name..."
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <button
              className="bg-black h-10 w-30 text-white rounded-lg ml-70"
              onClick={handleAddCategory}
            >
              Add category
            </button>
          </div>
        </>
      )}
    </section>
  );
}
