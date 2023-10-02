// admin can change the password of the existing user, which can be either a driver or a parent, or his own.
// in the request admin will send the existing username user_id, and new password.

import bcrypt from "bcrypt";
import userModel from "../../models/user.js";

export default async function forgotPassword(req, res) {
  const saltRounds = 10;
  const instituteId = req.body.payload.institute_id;
  const username = req.body.username;
  const newPassword = req.body.new_password;

  if (username == null || username.length < 8) {
    return res.status(400).json({ message: "username must be at least 8 characters long" });
  }

  if (newPassword == null || newPassword.length < 8) {
    return res.status(400).json({ message: "password must be at least 8 characters long" });
  }

  // check if there exists a user with this username, user_id, and instituteId;
  try {
    const user = await userModel.findOne({
      username: username,
      institute_id: instituteId,
    });

    if (user) {
      // if there is a user then update his password.
      //  hash the password.
      const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
      await userModel.updateOne(
        { username: username, institute_id: instituteId },
        {
          password: hashedPassword,
        }
      );
      return res.status(200).json({ message: "password updated successfully" });
    } else {
      // user not found
      return res.status(404).json({ message: "user not found in your institute" });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
