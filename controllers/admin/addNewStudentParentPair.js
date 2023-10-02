import bcrypt from "bcrypt";
import busModel from "../../models/bus.js";
import parentModel from "../../models/parent.js";
import userModel from "../../models/user.js";
import studentModel from "../../models/student.js";

export default async function addNewStudentParentPair(req, res) {
  const saltRounds = 10;
  const instituteId = req.body.payload.institute_id;
  const student = req.body.student;
  const parent = req.body.parent;
  const username = req.body.username;
  const password = req.body.password;

  // check if student and parent data exists
  if (student == null || parent == null) {
    return res.status(400).json({
      message: "either student or parent data does not exist.",
    });
  }

  if (password == null || password.length < 8) {
    return res.status(400).json({ message: "password must be at least 8 characters long" });
  }

  // todo: hash password
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  // validate the data as per the schema

  // check if username, password, role are valid
  const userData = new userModel({
    username: username,
    password: hashedPassword,
    role: "parent",
    institute_id: instituteId,
  });

  const userError = userData.validateSync();
  if (userError) {
    return res.status(400).json({
      type: "user error",
      message: usernameRoleErrorMessage(userError.errors),
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

  const studentError = newStudent.validateSync();
  if (studentError) {
    return res.status(400).json({
      type: "student error",
      message: studentError(studentError.errors),
    });
  }

  // check if there is any error in the parent data
  const newParent = new parentModel({
    name: parent.name,
    phone_no: parent.phone_no,
    gender: parent.gender,
    residence: parent.residence,
    username: username,
    institute_id: instituteId,
  });

  const parentError = newParent.validateSync();
  if (parentError) {
    return res.status(400).json({
      type: "parents error",
      message: parentError(parentError.errors),
    });
  }

  // check if
  // ---> username is available
  // ---> student with same class and roll no does not exist
  // ---> the bus alloted to a student is actually available to the institute.
  try {
    // check if username is available.
    const usernameFound = await userModel.findOne({ username: username });
    if (usernameFound) {
      // if username is not available.
      return res.status(400).json({
        type: "username",
        message: "username not available",
      });
    }
    // if a student exists with same class and roll no
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

    // insert into database
    // ---> user data
    // ---> student data
    // ---> parent data,

    // storing user data.
    await userData.save();
    // now we can insert the student in the database.
    await newStudent.save();

    // insert a new doc about a parent but we need to push the current student _id to the list of children  in the parent schema.
    // getting the _id of the stored student.
    const newStudentCreated = await studentModel
      .findOne({
        institute_id: instituteId,
        class: student.class,
        roll_no: student.roll_no,
      })
      .select({ _id: 1 })
      .exec();

    // insert the student _id to the parent's children list
    // insert parent into the database.
    newParent.children.push(newStudentCreated._id);
    await newParent.save();

    res.status(200).json({
      message: "student added",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

function usernameRoleErrorMessage(errors) {
  if (errors.username) {
    return errors.username.message;
  } else if (errors.role) {
    return errors.role.message;
  } else {
    return "something is wrong with user credentials.";
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

function parentError(errors) {
  if (errors.name) {
    return errors.name.message;
  } else if (errors.gender) {
    return errors.gender.message;
  } else if (errors.residence) {
    return errors.residence.message;
  } else if (errors.phone_no) {
    return errors.phone_no.message;
  } else return "something wrong with parent details";
}
