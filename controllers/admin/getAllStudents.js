import studentModel from "../../models/student.js";

export default async function getAllStudents(req, res) {
  const instituteId = req.body.payload.institute_id;

  try {
    const students = await studentModel.find({ institute_id: instituteId });
    if (!students) {
      students = [];
    }
    return res.status(200).json({
      students: students,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
