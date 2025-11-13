import { userModel } from "../../model/user-model.js";
import bcrypt from "bcrypt";

export const createUsers = async (req, res) => {
  const newUser = req.body;
  const password = newUser.password;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await userModel.create({
      email: newUser.email,
      password: hashedPassword,
      phoneNumber: newUser.phoneNumber,
      address: newUser.address,
      role: newUser.role,
      orderedFoods: newUser.orderedFoods,
      ttl: newUser.ttl,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });

    res.send("New user added", user);
  } catch (error) {
    res.send(error);
  }
};
