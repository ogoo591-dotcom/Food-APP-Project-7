import { foodOrderModel } from "../../model/foodOrder-model.js";
import { userModel } from "../../model/user-model.js";

export const createFoodOrder = async (req, res) => {
  const newFoodOrder = req.body;

  try {
    const foodOrder = await foodOrderModel.create({
      user: newFoodOrder.user,
      toralPrice: newFoodOrder.totalPrice,
      foodOrderItems: newFoodOrder.foodOrderItems,
      status: newFoodOrder.status,
      createdAt: newFoodOrder.createdAt,
      updatedAt: newFoodOrder.updatedAt,
    });

    res.send("New food-order added", foodOrder);
  } catch (error) {
    res.send(error);
  }
};
