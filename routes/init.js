import express from "express";
import "dotenv/config";
import sendVersionAndRoleBasedData from "../controllers/initialRequest.js";

const router = express.Router();

router.post("/", sendVersionAndRoleBasedData);
// router.post("/", async (req, res) => {
// the main things which are required are current version of app and authorization token.

// TODO: send the user with the latest version of app and also send him the link to update the app.

// TODO: check for authorization, if user is validated then don't display him the login screen, direct him to the main page of respective role.
// request would have authorization: "Bearer ${token}". which can be used for validation.
// ---> if user is validated, send him the json object according to his role.
// ---> else send him a json object to ask him for login.

export default router;
