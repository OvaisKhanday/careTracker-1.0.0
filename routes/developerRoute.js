import express from "express";

import registerNewInstitute from "../controllers/developer/registerNewInstitute.js";

const router = express.Router();

router.post("/", registerNewInstitute);

export default router;
