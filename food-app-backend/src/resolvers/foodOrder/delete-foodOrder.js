import { foodOrderModel } from "../../model/foodOrder-model.js";

export const deleteFoodOrder = async (req, res) => {
  const { foodOrderId } = req.params;

  try {
    const foodOrder = await foodOrderModel.findByIdAndDelete(foodOrderId);
    res.send("User deleted successfully!", foodOrder);
  } catch (error) {
    res.send(error);
  }
};
