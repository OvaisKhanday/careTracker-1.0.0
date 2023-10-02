import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./startup/dbConn.js";
import routes from "./startup/routes.js";

// connect to mongoDB
connectDB();

const app = express();

routes(app);

const port = process.env.PORT;

mongoose.connection.once("open", () => {
  console.log("database connected");
  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
  });
});
