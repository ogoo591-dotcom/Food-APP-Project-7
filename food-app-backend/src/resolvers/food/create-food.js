import { foodModel } from "../../model/food-model.js";

export const createFood = async (req, res) => {
  const newFood = req.body;

  try {
    const food = await foodModel.create({
      foodName: newFood.foodName,
      price: newFood.price,
      image: newFood.image,
      ingredients: newFood.ingredients,
      category: newFood.category,
      createdAt: newFood.createdAt,
      updatedAt: newFood.updatedAt,
    });
    res.send("New food added", food);
  } catch (error) {
    res.send(error);
  }
};
