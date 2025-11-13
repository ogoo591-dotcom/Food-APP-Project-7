import jwt from "jsonwebtoken";
import { userModel } from "../../model/user-model.js";

export const getRefresh = async (req, res) => {
  const token = await userModel.findOne({ token });
  const result = jwt.verify(token, role.admin);
  if (result) res.send("User deleted successfully!");
};
