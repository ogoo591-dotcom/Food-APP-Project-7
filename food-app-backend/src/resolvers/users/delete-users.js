import jwt from "jsonwebtoken";
import { userModel } from "../../model/user-model.js";

export const deleteUsers = async (req, res) => {
  const token = req.headers.authorization;

  try {
    jwt.verify(token, "secret-key");
    const newUser = await userModel.findByIdAndDelete(req.body._id);
    res.send("User deleted successfully!", newUser);
    console.log(newUser);
  } catch (err) {
    console.log(err);
    res.status(401).send("Unauthorized");
  }
};
