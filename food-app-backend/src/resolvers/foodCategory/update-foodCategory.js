import { foodCategoryModel } from "../../model/foodCategory-model.js";

export const updateFoodCategory = async (req, res) => {
  const updateFoodCategory = req.body;
  const { foodCategoryId } = req.params;

  await foodCategoryModel.findByIdAndUpdate(foodCategoryId, {
    categoryName: updateFoodCategory.categoryName,
  });
  res.send("Food-category updated successfully!");
};
