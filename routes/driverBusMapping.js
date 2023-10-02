import express from "express";
import validateAdmin from "../middleware/tokenValidation.js";
import driverBusMapping from "../controllers/admin/driverBusMapping.js";
import getDriverBusLists from "../controllers/admin/getDriverBusLists.js";

const router = express.Router();

router.post("/set", validateAdmin, driverBusMapping);
router.get("/get", validateAdmin, getDriverBusLists);

export default router;
