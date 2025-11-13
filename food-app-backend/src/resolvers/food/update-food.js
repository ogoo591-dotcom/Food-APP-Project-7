import { foodModel } from "../../model/food-model.js";

export const updateFood = async (req, res) => {
  const updateFood = req.body;
  const { foodId } = req.params;

  await foodModel.findByIdAndUpdate(foodId, {
    foodName: updateFood.foodName,
    price: updateFood.price,
    image: updateFood.image,
    ingredients: updateFood.ingredients,
    category: updateFood.category,
  });
  res.send("Food updated successfully!");
};
