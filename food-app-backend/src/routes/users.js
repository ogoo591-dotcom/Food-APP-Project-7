import express from "express";
import { getUsers } from "../resolvers/users/get-users.js";
import { createUsers } from "../resolvers/users/create-users.js";
import { updateUsers } from "../resolvers/users/update-users.js";
import { deleteUsers } from "../resolvers/users/delete-users.js";

export const router = express.Router();

router.get("/", getUsers);
router.post("/", createUsers);
router.put("/", updateUsers);
router.delete("/", deleteUsers);
