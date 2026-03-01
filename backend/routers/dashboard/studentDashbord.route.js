const express = require("express");
const router = express.Router();

const studentController = require("../../controllers/students/students.controller");

const allowedTo = require("../../middlewares/allowedTo");
const verifyToken = require("../../middlewares/verfiyToken");

router
  .route("/student/:studentId/attendance")
  .get(
    verifyToken,
    allowedTo("Admin", "Student"),
    studentController.getStudentAttendance
  );

router
  .route("/student/:studentId/grades")
  .get(
    verifyToken,
    allowedTo("Admin", "Student"),
    studentController.getStudentGrades
  );

module.exports = router;
