import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user.js";
import instituteModel from "../models/institute.js";
import driverModel from "../models/driver.js";
import parentModel from "../models/parent.js";
import studentModel from "../models/student.js";
import busModel from "../models/bus.js";
import "dotenv/config";

async function login(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  // check if username is available
  if (username == null || username.length < 8) {
    return res.status(400).json({
      type: "username",
      message: "username must be at least 8 characters long",
    });
  }
  // check the length of user password
  if (password == null || password.length < 8) {
    return res.status(400).json({
      type: "password",
      message: "password must be at least 8 characters long",
    });
  }

  try {
    const user = await userModel.findOne({ username: username });
    if (!user) {
      res.status(400).json({
        is_valid: false,
        type: "username",
        message: "username not found",
      });
      return;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        is_valid: false,
        type: "password",
        message: "incorrect password",
      });
      return;
    }

    // generate token
    const token = jwt.sign(
      {
        username: username,
        institute_id: user.institute_id,
        role: user.role,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: process.env.TOKEN_EXPIRES_IN,
      }
    );

    const institute = await instituteModel.findOne({ _id: user.institute_id });

    switch (user.role) {
      case "admin":
        // todo: send him school name and his details, which can be found in institute model.
        res.setHeader("token", token);
        res.status(200).json({
          role: user.role,
          institute: institute,
        });
        break;
      case "parent":
        // send him details of:
        // ---> institute
        // ---> parent details
        // ---> children list
        // ---> driver details
        // ---> bus (if it exists)
        const parent = await parentModel.findOne({ institute_id: user.institute_id, username: user.username }).populate("children").lean();
        if (!parent || parent.children == null) {
          return res.status(500).json({ message: "no parent found" });
        } else if (parent.children == null || parent.children.length <= 0) {
          return res.status(500).json({ message: "parent has no child registered" });
        }
        for (let i = 0; i < parent.children.length; i++) {
          const busNo = parent.children[i].bus_no;
          const bus = await busModel.findOne({ institute_id: user.institute_id, bus_no: busNo });
          if (!bus) {
            bus._id = null;
          }
          const driverOfBus = await driverModel.findOne({ institute_id: user.institute_id, bus_id: bus._id });

          parent.children[i].driver = driverOfBus;
          parent.children[i].bus = bus;
        }
        res.setHeader("token", token);
        res.status(200).json({
          role: user.role,
          institute: institute,
          parent: parent,
        });
        break;
      case "driver":
        // send him details of:
        // ---> institute
        // ---> driver details
        // ---> bus (if it exists)
        const driver = await driverModel.findOne({ institute_id: user.institute_id, username: user.username }).populate("bus_id").exec();
        if (!driver) {
          return res.status(500).json({ message: "no driver found" });
        }
        res.setHeader("token", token);
        res.status(200).json({
          role: user.role,
          institute: institute,
          driver: driver,
        });
        break;
    }
  } catch (error) {
    res.status(500);
  }
}

export default login;
