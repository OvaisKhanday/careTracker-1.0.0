// before the client posts his information about the new student, he would have been provided with the parent_id because
// he would have searched the parent according to the existing student class and roll no.
// So we will have in this request
// ---> parent _id
// ---> new student data.

import studentModel from "../../models/student.js";
import busModel from "../../models/bus.js";
import parentModel from "../../models/parent.js";

export default async function addNewStudentToExistingParent(req, res) {
  const parentId = req.body.parent_id;
  const student = req.body.student;
  const instituteId = req.body.payload.institute_id;

  // check if parentId and student does exist
  if (parentId == null || student == null) {
    return res.status(400).json({
      message: "either student or parent_id does not exist.",
    });
  }

  // check if there is any error in student data
  const newStudent = new studentModel({
    name: student.name,
    age: student.age,
    gender: student.gender,
    class: student.class,
    roll_no: student.roll_no,
    bus_no: student.bus_no,
    institute_id: instituteId,
  });

  const studentErrors = newStudent.validateSync();
  if (studentErrors) {
    return res.status(400).json({
      type: "student error",
      message: studentError(studentErrors.errors),
    });
  }

  try {
    // if a student exists with the same class and roll no
    const studentFoundWithSameClassAndRollNo = await studentModel.findOne({
      institute_id: instituteId,
      class: student.class,
      roll_no: student.roll_no,
    });
    if (studentFoundWithSameClassAndRollNo) {
      return res.status(400).json({
        type: "class_roll_no",
        message: `student with roll no: ${student.roll_no} and class: ${student.class} already present`,
      });
    }
    // check if the bus which is opted for a student is in the database.
    const busResult = await busModel.findOne({ institute_id: instituteId, bus_no: student.bus_no });
    if (!busResult) {
      // if bus is not available.
      return res.status(400).json({
        type: "bus",
        message: `There is no bus with no: ${student.bus_no} that is alloted to this institution`,
      });
    }

    // if everything goes well and code run to this point, it is the time to store the student to the database and add
    // the reference _id of student to the list of children of the parent.
    await newStudent.save();

    // get the _id of stored student
    const newStudentCreated = await studentModel
      .findOne({
        institute_id: instituteId,
        class: student.class,
        roll_no: student.roll_no,
      })
      .select({ _id: 1 })
      .exec();

    // push this student Id to the parent.
    await parentModel.findByIdAndUpdate(parentId, { $push: { children: newStudentCreated._id } });

    res.status(200).json({
      message: "student added successfully",
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
  } else {
    return "something wrong with student data";
  }
}
