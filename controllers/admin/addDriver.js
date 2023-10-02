import driverModel from "../../models/driver.js";
import userModel from "../../models/user.js";
import bcrypt from "bcrypt";

export default async function addDriver(req, res) {
  const saltRounds = 10;
  const newDriver = req.body.driver;
  const instituteId = req.body.payload.institute_id;
  const username = req.body.username;
  const password = req.body.password;

  if (username == null || username.length < 8) {
    return res.status(400).json({ message: "username must be at least 8 characters long" });
  }
  if (password == null || password.length < 8) {
    return res.status(400).json({ message: "password must be at least 8 characters long" });
  }
  if (newDriver == null) {
    return res.status(400).json({ message: "driver details not found" });
  }

  try {
    const result = await userModel.findOne({ username: username });
    if (result) {
      // if duplicate was found
      res.status(400).json({
        message: "username unavailable",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }

  // if username is available then create user at the database.
  const driverToBeAddedToDatabase = new driverModel({
    name: newDriver.name,
    age: newDriver.age,
    phone_no: newDriver.phone_no,
    residence: newDriver.residence,
    username: username,
    institute_id: instituteId,
  });
  // todo: hash the password,
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  const driverUsernameAndPassword = new userModel({
    username: username,
    password: hashedPassword,
    role: "driver",
    institute_id: instituteId,
  });

  let driverError = driverToBeAddedToDatabase.validateSync();
  let userError = driverUsernameAndPassword.validateSync();

  if (userError) {
    res.status(400).json({
      type: "username",
      // message: {
      //   username: userError.errors.username ? userError.errors.username.message : null,
      //   password: userError.errors.password ? userError.errors.password.message : null,
      //   role: userError.errors.role ? userError.errors.role.message : null,
      // },
      message: userError.errors.username
        ? userError.errors.username.message
        : userError.errors.password
        ? userError.errors.password.message
        : userError.errors.role
        ? userError.errors.role.message
        : "something wrong with username or password",
    });
    return;
  } else if (driverError) {
    res.status(400).json({
      type: "driver",
      // message: {
      //   name: driverError.errors.name ? driverError.errors.name.message : null,
      //   age: driverError.errors.age ? driverError.errors.age.message : null,
      //   phone_no: driverError.errors.phone_no ? driverError.errors.phone_no.message : null,
      //   residence: driverError.errors.residence ? driverError.errors.residence.message : null,
      // },
      message: driverError.errors.name
        ? driverError.errors.name.message
        : driverError.errors.age
        ? driverError.errors.age.message
        : driverError.errors.phone_no
        ? driverError.errors.phone_no.message
        : driverError.errors.residence
        ? driverError.errors.residence.message
        : "something wrong with driver details",
    });
    return;
  }

  try {
    await driverToBeAddedToDatabase.save();
    await driverUsernameAndPassword.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }

  res.status(200).json({
    message: "driver added",
  });
}
