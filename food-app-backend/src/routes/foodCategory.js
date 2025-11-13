import express from "express";
import { getFoodCategory } from "../resolvers/foodCategory/get-foodCategory.js";
import { deleteFoodCategory } from "../resolvers/foodCategory/delete-foodCategory.js";
import { createFoodCategory } from "../resolvers/foodCategory/create-footCategory.js";
import { updateFoodCategory } from "../resolvers/foodCategory/update-foodCategory.js";

export const foodCategories = express.Router();

foodCategories.get("/", getFoodCategory);
foodCategories.get("/:foodCategoryId", getFoodCategory);
foodCategories.post("/", createFoodCategory);
foodCategories.put("/:foodCategoryId", updateFoodCategory);
foodCategories.delete("/:foodCategoryId", deleteFoodCategory);
