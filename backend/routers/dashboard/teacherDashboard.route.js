const express = require("express");
const router = express.Router();

const teacherController = require("../../controllers/teachers/teacher.controller");
const allowedTo = require("../../middlewares/allowedTo");
const verifyToken = require("../../middlewares/verfiyToken");
router
  .route("/teacher/:teacherId/attendance")
  .get(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    teacherController.getTeacherAttendance
  );

router
  .route("/teacher/:teacherId/grades")
  .get(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    teacherController.getTeacherStudentsGrades
  );

module.exports = router;
