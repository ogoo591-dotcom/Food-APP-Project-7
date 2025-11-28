import express from "express";
import { createLogin } from "../resolvers/auth/create-loginAuth.js";
import { getMe } from "../resolvers/auth/me.js";

export const authentication = express.Router();

authentication.post("/", createLogin);
authentication.get("/", getMe);
