import busModel from "../../models/bus.js";

export default async function sendAllBuses(req, res) {
  const instituteId = req.body.payload.institute_id;

  //get all buses of an institution.

  try {
    const buses = await busModel.find({ institute_id: instituteId });
    res.status(200).json({ buses: buses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
