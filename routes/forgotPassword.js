import express from "express";
import validateAdmin from "../middleware/tokenValidation.js";
import forgotPasswordController from "../controllers/admin/forgotPasswordController.js";

const router = express.Router();

router.post("/", validateAdmin, forgotPasswordController);

export default router;
