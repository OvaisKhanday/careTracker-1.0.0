import driverModel from "../../models/driver.js";

export default async function sendAllDrivers(req, res) {
  const instituteId = req.body.payload.institute_id;

  // get all drivers alloted to an institute.
  try {
    const drivers = await driverModel.find({ institute_id: instituteId });
    if (!drivers) {
      drivers = [];
    }
    return res.status(200).json({
      drivers: drivers,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
