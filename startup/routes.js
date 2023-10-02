import express from "express";
import homeRoute from "../routes/home.js";
import developerRoute from "../routes/developerRoute.js";
import initialRoute from "../routes/init.js";
import apiRoute from "../routes/api.js";
import busManagementRoute from "../routes/busManagement.js";
import driverManagementRoute from "../routes/driverManagement.js";
import studentManagementRoute from "../routes/studentManagement.js";
import driverBusMappingRoute from "../routes/driverBusMapping.js";
import forgotPassword from "../routes/forgotPassword.js";
import loginRoute from "../routes/login.js";

export default function (app) {
  app.use(express.json());

  app.use("/", homeRoute);
  app.use("/api", apiRoute);
  app.use("/api/init", initialRoute);
  app.use("/api/login", loginRoute);
  app.use("/api/dev/register/institute", developerRoute);
  app.use("/api/admin/bus", busManagementRoute);
  app.use("/api/admin/driver", driverManagementRoute);
  app.use("/api/admin/driverBusMapping", driverBusMappingRoute);
  app.use("/api/admin/student", studentManagementRoute);
  app.use("/api/admin/forgotPassword", forgotPassword);
}
