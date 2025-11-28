import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { router } from "./src/routes/users.js";
import { foods } from "./src/routes/food.js";
import { foodOrders } from "./src/routes/foodOrder.js";
import { foodCategories } from "./src/routes/foodCategory.js";
import { authentication } from "./src/routes/auth.js";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.use("/users", router);
app.use("/food", foods);
app.use("/foodOrder", foodOrders);
app.use("/foodCategory", foodCategories);
app.use("/auth", authentication);

mongoose
  .connect("mongodb+srv://Otgoo4808:Otgoo4808@otgoo4808.pdxqvgz.mongodb.net/")
  .then(() => console.log("Connected!"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
