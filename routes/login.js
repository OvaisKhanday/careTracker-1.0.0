import express from "express";
import "dotenv/config";
import login from "../controllers/loginController.js";

const router = express.Router();

router.post("/", login);

export default router;
