import express from "express";
import "dotenv/config";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("careTracker");
});

export default router;
