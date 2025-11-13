import { foodModel } from "../../model/food-model.js";

export const deleteFood = async (req, res) => {
  const { foodId } = req.params;
  try {
    const food = await foodModel.findByIdAndDelete(foodId);
    res.send("Food deleted successfully!", food);
  } catch (error) {
    res.send(error);
  }
};
