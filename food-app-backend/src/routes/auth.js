import express from "express";
import { createLogin } from "../resolvers/auth/create-loginAuth.js";
import { getRefresh } from "../resolvers/auth/get-refreshAuth.js";

export const authentication = express.Router();

authentication.post("/", createLogin);
authentication.post("/", getRefresh);
