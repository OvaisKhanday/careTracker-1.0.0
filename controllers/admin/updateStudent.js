// we will have, before the client sends us with the updated details of a student, sent him the previous details of student with _id.
// !at the end of a session of a school, an admin must update the student class and roll no in top to bottom approach.
// 12th students followed by 11th and so on.

import studentModel from "../../models/student.js";
import busModel from "../../models/bus.js";

export default async function updateStudent(req, res) {
  const instituteId = req.body.payload.institute_id;
  const studentId = req.body._id;
  const student = req.body.student;

  if (studentId == null || student == null) {
    return res.status(400).json({ message: "student data not found" });
  }

  // check if there is any error in student data
  var ageInteger;
  var rollNoInteger;
  var busNoInteger;
  try {
    ageInteger = Number.parseInt(`${student.age}`);
    rollNoInteger = Number.parseInt(`${student.roll_no}`);
    busNoInteger = Number.parseInt(`${student.bus_no}`);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  const studentData = new studentModel({
    name: student.name,
    age: ageInteger,
    gender: student.gender,
    class: student.class,
    roll_no: rollNoInteger,
    bus_no: busNoInteger,
    institute_id: instituteId,
  });

  const studentErrors = studentData.validateSync();
  if (studentErrors) {
    return res.status(400).json({
      type: "student error",
      message: studentError(studentErrors.errors),
    });
  }

  try {
    // if a student exists with same class and roll no and different _id;
    const studentFoundWithSameClassAndRollNo = await studentModel
      .findOne({
        institute_id: instituteId,
        class: student.class,
        roll_no: rollNoInteger,
      })
      .select({ _id: 1 })
      .exec();
    if (studentFoundWithSameClassAndRollNo && studentFoundWithSameClassAndRollNo._id !== studentId) {
      return res.status(400).json({
        type: "class_roll_no",
        message: `student with roll no: ${student.roll_no} and class: ${student.class} already present`,
      });
    }
    // check if the bus which is opted for a student is in the database.
    const busResult = await busModel.findOne({ institute_id: instituteId, bus_no: busNoInteger });
    if (!busResult) {
      // if bus is not available.
      return res.status(400).json({
        type: "bus",
        message: `There is no bus with no: ${student.bus_no} that is alloted to this institution`,
      });
    }

    // update the student.
    await studentModel.findByIdAndUpdate(studentId, {
      name: student.name,
      age: ageInteger,
      gender: student.gender,
      class: student.class,
      roll_no: rollNoInteger,
      bus_no: busNoInteger,
    });

    res.status(200).json({
      message: "student updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

function studentError(errors) {
  if (errors.name) {
    return errors.name.message;
  } else if (errors.age) {
    return errors.age.message;
  } else if (errors.gender) {
    return errors.gender.message;
  } else if (errors.class) {
    return errors.class.message;
  } else if (errors.roll_no) {
    return errors.roll_no.message;
  } else if (errors.bus_no) {
    return errors.bus_no.message;
  } else return "something wrong with student details";
}
