import bcrypt from "bcrypt";
import instituteModel from "../../models/institute.js";
import userModel from "../../models/user.js";

export default async function registerNewInstitute(req, res) {
  const developerHashedPassword = "$2b$10$wuZSmEAvv2AqyhchRoxfHu33.5re/n8ZpnaNxcX1SRRrfEjCU2F.G";
  const saltRounds = 10;

  const developerPassword = req.body.password;
  const institute = req.body.institute;
  const admin = req.body.admin;
  const username = req.body.admin ? req.body.admin.username : null;
  const password = req.body.admin ? req.body.admin.password : null;

  // authenticate the developer
  if (!bcrypt.compareSync(developerPassword, developerHashedPassword)) {
    return res.status(400).json({
      message: "you are not eligible to add a new institution",
    });
  }

  // check the length of user password
  if (password == null || password.length < 8) {
    return res.status(400).json({ message: "password must be at least 8 characters long" });
  }

  // check if username is available
  if (username == null || username.length < 8) {
    return res.status(400).json({ message: "username must be at least 8 characters long" });
  }

  try {
    const usernameNotAvailable = await userModel.findOne({ username: username });
    if (usernameNotAvailable) {
      return res.status(400).json({ message: "username is not available." });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  // validate institute details.
  const newInstitute = new instituteModel({
    name: institute ? institute.name : null,
    principal: institute ? institute.principal : null,
    admin: {
      name: admin ? admin.name : null,
      phone_no: admin ? admin.phone_no : null,
      username: username,
    },
  });

  const instituteError = newInstitute.validateSync();
  if (instituteError) {
    return res.status(400).json({
      type: "institute",
      error: {
        institute_name: instituteError.errors.name ? instituteError.errors.name.message : null,
        principal: instituteError.errors.principal ? instituteError.errors.principal.message : null,
        admin_name: instituteError.errors["admin.name"] ? instituteError.errors["admin.name"].message : null,
        admin_phone_no: instituteError.errors["admin.phone_no"] ? instituteError.errors["admin.phone_no"].message : null,
        admin_username: instituteError.errors["admin.username"] ? instituteError.errors["admin.username"].message : null,
      },
    });
  }

  // generate the hash for the admin password
  // validate the user data
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const newUser = new userModel({
    username: username,
    role: "admin",
    password: hashedPassword,
  });
  const userError = newUser.validateSync();
  if (userError) {
    return res.status(400).json({
      type: "user",
      error: {
        username: userError.errors.username ? userError.errors.username.message : null,
        password: userError.errors.password ? userError.errors.password.message : null,
        role: userError.errors.role ? userError.errors.role.message : null,
      },
    });
  }

  try {
    // if institute and user data is validated then it is time to add them in database.
    // add institute first and then add user with reference to institute.

    await newInstitute.save();
    const instituteCreated = await instituteModel.findOne({ "admin.username": username }, { _id: 1 });

    console.log(instituteCreated);

    // save user data;
    newUser.institute_id = instituteCreated._id;
    await newUser.save();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.status(200).json({
    message: "institute registered",
  });
}
