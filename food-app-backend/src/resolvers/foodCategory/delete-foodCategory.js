import { foodCategoryModel } from "../../model/foodCategory-model.js";

export const deleteFoodCategory = async (req, res) => {
  const { foodCategoryId } = req.params;

  try {
    const foodCategory = await foodCategoryModel.findByIdAndDelete(
      foodCategoryId
    );
    res.send("Food category deleted successfully!", foodCategory);
  } catch (error) {
    res.send(error);
  }
};
