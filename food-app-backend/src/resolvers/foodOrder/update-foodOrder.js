import { foodOrderModel } from "../../model/foodOrder-model.js";

export const updateFoodOrder = async (req, res) => {
  const updateFoodOrder = req.body;
  const { foodOrderId } = req.params;

  await foodOrderModel.findByIdAndUpdate(foodOrderId, {
    user: updateFoodOrder.user,
    totalPrice: updateFoodOrder.totalPrice,
    foodOrderItems: updateFoodOrder.foodOrderItems,
    status: updateFoodOrder.status,
  });
  res.send("Food-order updated successfully!");
};
