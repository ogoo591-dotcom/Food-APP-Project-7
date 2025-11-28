import { foodModel } from "../../model/food-model.js";
import { foodCategoryModel } from "../../model/foodCategory-model.js";

export const getFoodCategory = async (req, res) => {
  const dbFoodCategory = await foodCategoryModel.find();

  const categories = await Promise.all(
    dbFoodCategory.map(async (cur) => {
      const foods = await foodModel.find({ category: cur._id });
      return {
        _id: cur._id,
        categoryName: cur.categoryName,
        food: foods.length,
      };
    })
  );

  res.status(200).json(categories);
};
