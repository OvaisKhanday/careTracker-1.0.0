import express from "express";
import validateAdmin from "../middleware/tokenValidation.js";
import addNewStudentParentPair from "../controllers/admin/addNewStudentParentPair.js";
import addNewStudentToExistingParent from "../controllers/admin/addNewStudentToExistingParent.js";
import updateStudent from "../controllers/admin/updateStudent.js";
import deleteStudent from "../controllers/admin/deleteStudent.js";
import getClassGenderBuses from "../controllers/admin/getClassGenderBuses.js";
import getParentDetails from "../controllers/admin/getParentDetails.js";
import getAllStudents from "../controllers/admin/getAllStudents.js";
import searchStudent from "../controllers/admin/searchStudent.js";

const router = express.Router();

router.get("/getClassGenderBuses", validateAdmin, getClassGenderBuses);
router.get("/getAllStudents", validateAdmin, getAllStudents);
router.post("/add/new", validateAdmin, addNewStudentParentPair);
router.post("/add/existing/search", validateAdmin, getParentDetails);
router.post("/add/existing", validateAdmin, addNewStudentToExistingParent);
router.post("/update", validateAdmin, updateStudent);
router.post("/search", validateAdmin, searchStudent);
router.post("/delete", validateAdmin, deleteStudent);

export default router;
