import { foodOrderModel } from "../../model/foodOrder-model.js";

export const getFoodOrder = async (req, res) => {
  try {
    const { foodOrderId } = req.params;

    if (foodOrderId) {
      const one = await foodOrderModel.findById(foodOrderId);

      return one ? res.json(one) : res.status(404).json({ error: "Not found" });
    }
    const all = await foodOrderModel
      .find()
      .populate("user")
      .populate("foodOrderItems.food")
      .sort({ createdAt: -1 });
    return res.json(all);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
