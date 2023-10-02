import driverModel from "../../models/driver.js";
import userModel from "../../models/user.js";

export default async function deleteDriver(req, res) {
  // delete driver on the basis of his _id;
  const id = req.body._id;
  const instituteId = req.body.payload.institute_id;
  // build an alert dialog in app to delete a single driver at a time.

  if (!id) {
    return res.status(400).json({
      message: "driver details not provided",
    });
  }

  //todo: remove entry of user data from the database.
  try {
    const driver = await driverModel.findById(id);
    if (driver) {
      await userModel.deleteOne({
        username: driver.username,
        institute_id: instituteId,
      });
      await driverModel.findByIdAndDelete(id);
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
  res.status(200).json({
    message: "driver deleted",
  });
}
