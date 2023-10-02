// the client would send us _id of the student to be deleted.
// when he searched for a student with class and roll No we would have provided him with the _id of the student.

import parentModel from "../../models/parent.js";
import studentModel from "../../models/student.js";
import userModel from "../../models/user.js";

export default async function deleteStudent(req, res) {
  const studentId = req.body._id;
  const instituteId = req.body.payload.institute_id;

  if (studentId == null) {
    return res.status(400).json({
      message: "student data not provided",
    });
  }
  // find the student and remove the reference of his parent from the database
  // if this was the only child of the parent then remove his user details as well.

  // find the parent with the student_id as one of his children array item.
  // delete this id from his list and check the length of the list
  // if the length of the list is 0,then remove parent as well as parent's login credentials.

  // finding a parent with student_id
  try {
    const isStudentPresent = await studentModel.findById(studentId);
    if (!isStudentPresent) {
      return res.status(400).json({ message: "student not found" });
    }

    const parent = await parentModel.findOne({ children: { $in: [studentId] } });

    if (parent) {
      const parentChildrenList = parent.children;

      // got the children list.
      if (parentChildrenList.length > 1) {
        // we don't have to delete the parent
        // remove the reference of the student from the parent.
        await parentModel.findByIdAndUpdate(parent._id, {
          $pullAll: {
            children: [studentId],
          },
        });
      } else {
        // remove the parent as well.
        // it means parent has only this child.
        // remove parent and user data of parent.
        await userModel.findOneAndRemove({ username: parent.username, institute_id: instituteId });
        await parentModel.findByIdAndDelete(parent._id);
      }
    }

    // delete student from the database
    await studentModel.findByIdAndDelete(studentId);

    res.status(200).json({
      message: "student deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
