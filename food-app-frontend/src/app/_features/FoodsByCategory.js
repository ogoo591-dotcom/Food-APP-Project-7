"use client";
import { useEffect, useState } from "react";
import { MenuCards } from "../_component/MenuCards.js";
import { RiDeleteBin7Line } from "react-icons/ri";
import { toast } from "sonner";

const UPLOAD_PRESET = "food-app";
const CLOUD_NAME = "dou1av6jm";
const backend_url = process.env.PUBLIC_BACKEND_URL;

export const FoodsByCategory = ({ categoryId, categoryName }) => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [newDish, setNewDish] = useState({
    foodName: "",
    price: "",
    ingredients: "",
  });
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);

  const menuData = async () => {
    const data = await fetch(`${backend_url}/food/category/${categoryId}`);
    const jsonData = await data.json();
    setMenu(jsonData);
    console.log(setMenu);
  };

  const loadCategories = async () => {
    const r = await fetch(`${backend_url}/foodCategory`);
    const data = await r.json();
    setCategories(data);
  };
  useEffect(() => {
    menuData();
    loadCategories();
  }, [categoryId]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setLogoUrl(url);
    } catch (err) {
      console.log("Failed to upload logo: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddDish = async () => {
    try {
      const res = await fetch(`${backend_url}/food`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          ...newDish,
          price: Number(newDish.price) || 0,
          category: categoryId,
        }),
      });

      const created = await res.json().catch(() => null);
      if (!res.ok) throw new Error(created?.message || "Create failed");

      if (created?._id) {
        setMenu((prev) => [created, ...prev]);
      } else {
        await menuData();
      }
      toast("New dish is being added to the menu", { position: "top-center" });
      setCreateOpen(false);
      setNewDish({ foodName: "", price: "", ingredients: "", image: "" });
    } catch (e) {
      console.error(e);
    }
  };
  const openEdit = (dish) => {
    setEdit({
      _id: dish._id,
      foodName: dish.foodName,
      price: dish.price,
      ingredients: dish.ingredients,
      image: dish.image,
      category: dish.category,
    });
    setOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const r = await fetch(`${backend_url}/food/${edit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodName: edit.foodName,
          price: edit.price,
          ingredients: edit.ingredients,
          image: edit.image,
          category: edit.category,
        }),
      });
      setMenu((prev) =>
        prev.map((d) => (d._id === edit._id ? { ...d, ...next } : d))
      );
      setOpen(false);
      setEdit(null);
      toast("Dish successfully saved.", { position: "top-center" });
    } catch (e) {
      console.error(e);
    }
  };
  const handleDeleteDish = async () => {
    try {
      if (!edit?._id) return;

      const r = await fetch(`${backend_url}/food/${edit._id}`, {
        method: "DELETE",
      });
      if (!r.ok) throw new Error("Delete failed");

      setMenu((prev) => prev.filter((d) => d._id !== edit._id));
      setOpen(false);
      setEdit(null);
      toast("Dish successfully deleted.", {
        position: "top-center",
        style: { borderRadius: "12px" },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full h-auto text-white bg-gray-50 rounded-2xl">
      <h3 className="text-2xl mt-5 ml-5 font-semibold text-black">
        {categoryName}
        <span className="text-black">
          ({Array.isArray(menu) ? menu.length : 0})
        </span>
      </h3>
      <div className="w-full h-auto overflow gap-3 flex flex-wrap py-5 ml-8">
        <div className="w-[270px] h-[241px] border-red-500 border border-dashed rounded-3xl flex justify-center items-center flex-col text-black gap-5">
          <button
            aria-label="Add category"
            className="grid h-10 w-10 place-items-center rounded-full bg-rose-500 text-white shadow-sm transition hover:scale-105 active:scale-95"
            onClick={() => setCreateOpen(true)}
          >
            +
          </button>
          <div className="flex justify-center flex-col items-center">
            <p>{categoryName}</p>
            <p className="text-l text-red-400">ШИНЭЭР НЭМЭХ</p>
          </div>
        </div>
        {(Array.isArray(menu) ? menu : []).map((dish) => (
          <MenuCards
            key={dish._id}
            dish={dish}
            onOpen={openEdit}
            onDelete={() => handleDeleteDish(dish._id)}
          />
        ))}
        {createOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setCreateOpen(false)}
            />
            <div className="fixed left-1/2 top-1/2 z-50 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-black flex gap-2">
                  {categoryName}
                  <p className="text-red-400"> шинээр нэмэх</p>
                </h4>
                <button
                  className="grid h-10 w-10 place-items-center rounded-full bg-neutral-200 text-xl text-gray-500"
                  onClick={() => setCreateOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <label className="flex-1 text-sm text-neutral-600">
                    Food name
                    <input
                      className="mt-2 h-10 w-full rounded-lg border px-3 outline-none"
                      value={newDish.foodName}
                      placeholder="Type food name"
                      onChange={(e) =>
                        setNewDish((f) => ({ ...f, foodName: e.target.value }))
                      }
                    />
                  </label>
                  <label className="w-40 text-sm text-neutral-600">
                    Price
                    <input
                      className="mt-2 h-10 w-full rounded-lg border px-3 outline-none"
                      value={newDish.price}
                      placeholder="Enter price..."
                      onChange={(e) =>
                        setNewDish((f) => ({ ...f, price: e.target.value }))
                      }
                    />
                  </label>
                </div>

                <label className="block text-sm text-neutral-600">
                  Ingredients
                  <textarea
                    className="mt-2 h-24 w-full rounded-lg border px-3 py-2 outline-none"
                    value={newDish.ingredients}
                    placeholder="List ingredients..."
                    onChange={(e) =>
                      setNewDish((f) => ({ ...f, ingredients: e.target.value }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-neutral-600">
                  Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="mb-4 p-2 w-full h-30 border border-gray-300 rounded-lg"
                  />
                  {uploading && <p className="text-blue-600">Uploading...</p>}
                  {logoUrl && (
                    <div className="mt-4">
                      <p className="text-green-600 font-semibold mb-2">
                        Logo uploaded!
                      </p>

                      <div className="relative w-64 h-64">
                        <img
                          src={logoUrl}
                          alt="Uploaded logo"
                          className="object-contain rounded border border-gray-300"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-600 break-all">
                        {logoUrl}
                      </p>
                    </div>
                  )}
                </label>

                <div className="flex justify-end">
                  <button
                    onClick={handleAddDish}
                    className="h-10 w-28 rounded-lg bg-black text-white"
                    variant="outline"
                  >
                    Add Dish
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {open && edit && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setOpen(false)}
            />
            <div className="fixed left-1/2 top-1/2 z-50 w-[472px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-black">
                  Dishes info
                </h4>
                <button
                  className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-xl text-gray-500"
                  onClick={() => setOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <label className="text-sm text-neutral-600 flex justify-between items-center">
                  Dish name
                  <input
                    className="mt-2 h-11 w-70 rounded-lg border px-3 outline-none"
                    value={edit.foodName}
                    onChange={(e) =>
                      setEdit((d) => ({ ...d, foodName: e.target.value }))
                    }
                  />
                </label>

                <label className="text-sm text-neutral-600 flex justify-between items-center">
                  Dish category
                  <div className="relative">
                    <select
                      className="mt-2 h-11 w-70 rounded-lg border px-3 outline-none appearance-none pr-10"
                      value={edit.category}
                      onChange={(e) =>
                        setEdit((d) => ({ ...d, category: e.target.value }))
                      }
                    >
                      {categories.map((c) => (
                        <option key={c._id ?? c.id} value={c._id ?? c.id}>
                          {c.categoryName ?? c.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-[22px] h-4 w-4 text-neutral-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </label>

                <label className="flex justify-between items-center text-sm text-neutral-600">
                  Ingredients
                  <textarea
                    className="mt-2 h-24 w-70 rounded-lg border px-3 py-2 outline-none"
                    value={edit.ingredients}
                    onChange={(e) =>
                      setEdit((d) => ({
                        ...d,
                        ingredients: e.target.value,
                      }))
                    }
                  />
                </label>

                <label className="flex justify-between items-center text-sm text-neutral-600">
                  Price
                  <input
                    className="mt-2 h-11 w-70 rounded-lg border px-3 outline-none"
                    value={edit.price}
                    onChange={(e) =>
                      setEdit((d) => ({ ...d, price: e.target.value }))
                    }
                  />
                </label>

                <label className="flex justify-between items-center text-sm text-neutral-600">
                  Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="mb-4 p-2 w-70 h-30 border border-gray-300 rounded-lg"
                  />
                  {uploading && <p className="text-blue-600">Uploading...</p>}
                  {logoUrl && (
                    <div className="mt-4">
                      <p className="text-green-600 font-semibold mb-2">
                        Logo uploaded!
                      </p>

                      <div className="relative w-64 h-64">
                        <img
                          src={image}
                          alt="Uploaded logo"
                          className="object-contain rounded border border-gray-300"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-600 break-all">
                        {logoUrl}
                      </p>
                    </div>
                  )}
                </label>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    className="rounded-xl border border-red-200 px-4 py-3 text-red-600"
                    onClick={handleDeleteDish}
                    title="Delete dish"
                  >
                    <RiDeleteBin7Line />
                  </button>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveEdit}
                      className="rounded-xl bg-black px-5 py-3 text-white"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
