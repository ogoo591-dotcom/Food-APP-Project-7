import { foodModel } from "../../model/food-model.js";

export const getFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    if (foodId) {
      const one = await foodModel.findById(foodId);
      return one ? res.json(one) : res.status(404).json({ error: "Not found" });
    }
    const all = await foodModel
      .find()
      .populate("category")
      .sort({ createdAt: -1 });
    return res.json(all);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
