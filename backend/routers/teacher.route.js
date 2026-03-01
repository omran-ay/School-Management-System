const teacherController = require("../controllers/teachers/teacher.controller");
const express = require("express");
const router = express.Router();
const validateTeacher = require("../middlewares/validations/teacher.validation");

const allowedTo = require("../middlewares/allowedTo");
const verifyToken = require("../middlewares/verfiyToken");

//teachers
router
  .route("/")
  .get(verifyToken, allowedTo("Admin"), teacherController.getAllTeachers);
router
  .route("/addNewTeacher")
  .post(
    validateTeacher.validateTeacherOnCreate(),
    verifyToken,
    allowedTo("Admin"),
    teacherController.addNewTeacher
  );

router
  .route("/:teacherId")
  .get(verifyToken, teacherController.GetSingleTeacher)
  .patch(
    validateTeacher.validateTeacherOnUpdate(),
    verifyToken,
    allowedTo("Admin"),
    teacherController.UpdateTeacher
  )
  .delete(verifyToken, allowedTo("Admin"), teacherController.DeleteTeacher);

module.exports = router;
