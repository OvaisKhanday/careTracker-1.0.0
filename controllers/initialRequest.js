import versionModel from "../models/version.js";
import instituteModel from "../models/institute.js";
import userModel from "../models/user.js";
import parentModel from "../models/parent.js";
import busModel from "../models/bus.js";
import driverModel from "../models/driver.js";
import jwt from "jsonwebtoken";

async function sendVersionAndRoleBasedData(req, res, next) {
  // read version details.
  const versionDetails = await versionModel.findOne({});

  // authenticate the user by the token he sent
  // get the token out of the header
  const authorization = req.headers["authorization"];
  // authorization = "Bearer $token"
  let token;
  let payload;
  try {
    token = authorization.split(" ")[1];
    payload = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (error) {
    return res.status(200).json({
      user_found: false,
      app_details: versionDetails,
    });
  }

  // we have payload now it contains the username, institute_id, and role.
  // user is a valid user we can serve him the data according to his role, which can be determined from role attribute from payload.
  let user;

  let institute;
  try {
    user = await userModel.findOne({
      institute_id: payload.institute_id,
      username: payload.username,
      role: payload.role,
    });

    institute = await instituteModel.findById(payload.institute_id);

    if (!user || !institute) {
      // if user has token saved but is deleted by an admin. in the case of a driver or a parent.
      return res.status(200).json({
        user_found: false,
        app_details: versionDetails,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  switch (payload.role) {
    case "admin":
      // todo: send him school name and his details, which can be found in institute model.
      res.setHeader("token", token);
      res.status(200).json({
        role: "admin",
        user_found: true,
        app_details: versionDetails,
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
        role: "parent",
        user_found: true,
        app_details: versionDetails,
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
        role: "driver",
        user_found: true,
        app_details: versionDetails,
        institute: institute,
        driver: driver,
      });
      break;

    default:
      return res.status(200).json({
        user_found: false,
        app_details: versionDetails,
      });
  }
}

export default sendVersionAndRoleBasedData;
