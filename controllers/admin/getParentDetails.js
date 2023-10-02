import studentModel from "../../models/student.js";
import parentModel from "../../models/parent.js";

export default async function getParentDetails(req, res) {
  const instituteId = req.body.payload.institute_id;

  const searchClass = req.body.class;
  const searchRollNoString = req.body.roll_no;

  try {
    const searchRollNo = Number.parseInt(searchRollNoString);
    const student = await studentModel.findOne({
      institute_id: instituteId,
      class: searchClass,
      roll_no: searchRollNo,
    });

    if (!student) {
      return res.status(400).json({ message: `no student found with class ${searchClass} and roll no: ${searchRollNo}` });
    }

    const parent = await parentModel.findOne({ children: { $in: [student._id] } });

    return res.status(200).json({
      parent: parent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
