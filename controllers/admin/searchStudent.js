import studentModel from "../../models/student.js";

// search student by class and roll no.

export default async function searchStudent(req, res) {
  const instituteId = req.body.payload.institute_id;

  const class_ = req.body.class;
  const rollNoString = req.body.roll_no;

  try {
    const rollNo = Number.parseInt(rollNoString);
    const student = await studentModel.findOne({ institute_id: instituteId, class: class_, roll_no: rollNo });
    if (!student) {
      return res.status(400).json({ message: `student with class: ${class_} and roll no: ${rollNo} does not exist` });
    }

    return res.status(200).json({
      student: student,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
