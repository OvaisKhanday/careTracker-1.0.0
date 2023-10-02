import express from "express";
import validateAdmin from "../middleware/tokenValidation.js";
import addDriver from "../controllers/admin/addDriver.js";
import updateDriver from "../controllers/admin/updateDriver.js";
import deleteDriver from "../controllers/admin/deleteDriver.js";
import sendAllDrivers from "../controllers/admin/sendAllDrivers.js";

const router = express.Router();

router.get("/all", validateAdmin, sendAllDrivers);
router.post("/add", validateAdmin, addDriver);
router.post("/update", validateAdmin, updateDriver);
router.post("/delete", validateAdmin, deleteDriver);

export default router;
