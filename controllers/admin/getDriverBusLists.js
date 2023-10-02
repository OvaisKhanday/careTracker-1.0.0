import busModel from "../../models/bus.js";
import driverModel from "../../models/driver.js";

export default async function getDriverBusLists(req, res) {
  const instituteId = req.body.payload.institute_id;

  try {
    const drivers = await driverModel.find({ institute_id: instituteId }).populate({ path: "bus_id", model: busModel }).exec();
    const buses = await busModel.find({ institute_id: instituteId });

    if (drivers == null || buses == null) {
      return res.status(400).json({ message: "drivers or buses not yet added." });
    }
    console.log(drivers);
    console.log(buses);

    return res.status(200).json({
      drivers: drivers,
      buses: buses,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
