import express from "express";
import { getFood } from "../resolvers/food/get-food.js";
import { createFood } from "../resolvers/food/create-food.js";
import { deleteFood } from "../resolvers/food/delete-food.js";
import { updateFood } from "../resolvers/food/update-food.js";
import { getFoodByCategorryId } from "../resolvers/food/get-food-id.js";

export const foods = express.Router();

foods.get("/", getFood);
foods.get("/category/:categoryId", getFoodByCategorryId);
foods.get("/:foodId", getFood);
foods.post("/", createFood);
foods.put("/:foodId", updateFood);
foods.delete("/:foodId", deleteFood);
