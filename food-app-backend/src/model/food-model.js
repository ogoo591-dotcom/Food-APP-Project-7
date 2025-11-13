import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FoodSchema = new Schema({
  id: ObjectId,
  foodName: { type: String, required: true, default: "No Name" },
  price: Number,
  image: { type: String },
  ingredients: { type: String, required: true, default: "No email added" },
  category: { type: ObjectId, required: true, ref: "foodCategory" },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

export const foodModel = mongoose.model("food", FoodSchema);
