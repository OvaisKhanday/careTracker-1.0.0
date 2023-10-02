import busModel from "../../models/bus.js";
import driverModel from "../../models/driver.js";
import studentModel from "../../models/student.js";

export default async function removeBus(req, res) {
  const busId = req.body.bus_id;
  const instituteId = req.body.payload.institute_id;

  if (busId == null || busId.length === 0) {
    return res.status(400).json({ message: "bus details not provided" });
  }

  try {
    // find bus.
    // todo: if the bus is associated with any driver the driver should be located and his reference should be deleted.
    // todo: same thing should be done to the students, the reference or bus_no attribute of the students should also be removed. should

    // check if the bus exists
    const bus = await busModel.findOne({ _id: busId, institute_id: instituteId });

    if (!bus) {
      return res.status(400).json({ message: "bus not found" });
    }

    // delete reference from associated driver, if any.
    await driverModel.findOneAndUpdate(
      {
        bus_id: busId,
        institute_id: instituteId,
      },
      { $unset: { bus_id: "" } }
    );

    // delete the bus entry from the students.
    await studentModel.updateMany(
      {
        institute_id: instituteId,
        bus_no: bus.bus_no,
      },
      {
        $unset: { bus_no: "" },
      }
    );

    await busModel.findOneAndRemove({ _id: busId, institute_id: instituteId });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
  res.status(200).json({
    message: "bus deleted",
  });
}
