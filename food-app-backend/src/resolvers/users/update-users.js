import { userModel } from "../../model/user-model.js";

export const updateUsers = async (req, res) => {
  const updateUser = req.body;

  await userModel.findByIdAndUpdate(req.body._id, {
    email: updateUser.email,
    password: updateUser.password,
    phoneNumber: updateUser.phoneNumber,
    address: updateUser.address,
    role: updateUser.role,
    orderedFoods: updateUser.orderedFoods,
    ttl: updateUser.ttl,
    isVerified: updateUser.isVerified,
    updatedAt: updateUser.updatedAt,
  });
  res.send("User updated successfully!");
};
