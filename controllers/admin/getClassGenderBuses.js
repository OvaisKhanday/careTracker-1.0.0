import busModel from "../../models/bus.js";

export default async function getClassGenderBuses(req, res) {
  const instituteId = req.body.payload.institute_id;

  // get class list.
  const classes = ["Pre", "Nur", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
  const studentGenders = ["male", "female", "other"];
  const parentGenders = ["male", "female"];
  var buses = [];
  try {
    buses = await busModel.find({ institute_id: instituteId }).select({ bus_no: 1, _id: 1 }).exec();
    console.log(buses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json({
    classes: classes,
    student_genders: studentGenders,
    parent_genders: parentGenders,
    buses: buses,
  });
}
