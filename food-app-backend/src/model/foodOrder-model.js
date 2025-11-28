import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FoodOrderSchema = new Schema(
  {
    user: { type: ObjectId, required: true, ref: "user" },
    deliveryAddress: { type: String },
    totalPrice: Number,
    foodOrderItems: [
      {
        food: { type: ObjectId, required: true, ref: "food" },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "DELIVERED"],
      default: "PENDING",
    },
    deliveryAddress: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const foodOrderModel = mongoose.model("foodOrder", FoodOrderSchema);
