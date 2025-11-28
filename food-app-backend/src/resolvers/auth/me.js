import jwt from "jsonwebtoken";
import { userModel } from "../../model/user-model.js";

export const getMe = async (req, res) => {
  const token = req.headers.authorization;

  try {
    console.log(token);
    const { id } = jwt.verify(token, "secret-key");
    const user = await userModel.findById(id);

    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(401).send("Unauthorized");
  }
};
