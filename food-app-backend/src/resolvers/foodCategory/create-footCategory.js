import { foodCategoryModel } from "../../model/foodCategory-model.js";

export const createFoodCategory = async (req, res) => {
  const newFoodCategory = req.body;

  try {
    const foodCategory = await foodCategoryModel.create({
      categoryName: newFoodCategory.categoryName,
      createdAt: newFoodCategory.createdAt,
      updatedAt: newFoodCategory.updatedAt,
    });
    res.send("New food-category added", foodCategory);
  } catch (error) {
    res.send(error);
  }
};
