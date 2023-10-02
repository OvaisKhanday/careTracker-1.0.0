// this is the route where admin sends the bus-registration and bus-no pairs to be added into the database.

import express from "express";
import validateAdmin from "../middleware/tokenValidation.js";
import addBus from "../controllers/admin/addBus.js";
import removeBus from "../controllers/admin/removeBus.js";
import updateBuses from "../controllers/admin/updateBuses.js";
import sendAllBuses from "../controllers/admin/sendAllBuses.js";

const router = express.Router();

// admin will send the objects of bus no and bus registration.
// check for the data validation
router.post("/add", validateAdmin, addBus);
router.post("/remove", validateAdmin, removeBus);
router.post("/update", validateAdmin, updateBuses);
router.post("/all", validateAdmin, sendAllBuses);

export default router;
