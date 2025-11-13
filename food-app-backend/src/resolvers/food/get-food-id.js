import { foodModel } from "../../model/food-model.js";

export const getFoodByCategorryId = async (req, res) => {
  try {
    const foods = await foodModel.find({ category: req.params.categoryId });

    return res.status(200).json(foods);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
