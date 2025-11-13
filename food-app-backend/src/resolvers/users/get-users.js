import { userModel } from "../../model/user-model.js";

export const getUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId) {
      const one = await userModel.findById(userId).populate({
        path: "foodOrder",
        populate: {
          path: "foodOrderItems.food",
        },
      });
      return one ? res.json(one) : res.status(404).json({ error: "Not found" });
    }
    const all = await userModel.find().populate({
      path: "orderedFoods",
      populate: {
        path: "foodOrderItems.food",
      },
    });
    return res.json(all);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
