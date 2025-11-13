import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FoodCategorySchema = new Schema({
  id: ObjectId,
  categoryName: { type: String, required: true, default: "No Category-Name" },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

export const foodCategoryModel = mongoose.model(
  "foodCategory",
  FoodCategorySchema
);
