import express from "express";
import { getFoodOrder } from "../resolvers/foodOrder/get-foodOrder.js";
import { createFoodOrder } from "../resolvers/foodOrder/create-foodOrder.js";
import { updateFoodOrder } from "../resolvers/foodOrder/update-foodOrder.js";
import { deleteFoodOrder } from "../resolvers/foodOrder/delete-foodOrder.js";

export const foodOrders = express.Router();

foodOrders.get("/", getFoodOrder);
foodOrders.get("/:foodOrderId", getFoodOrder);
foodOrders.post("/", createFoodOrder);
foodOrders.put("/:foodOrderId", updateFoodOrder);
foodOrders.delete("/:foodOrderId", deleteFoodOrder);
