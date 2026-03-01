const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/dashboard/admin.controller");
const timetableController = require("../../controllers/timetable/timetable.controller");
const allowedTo = require("../../middlewares/allowedTo");
const verifyToken = require("../../middlewares/verfiyToken");

router
  .route("/student/:id/full-profile")
  .get(
    verifyToken,
    allowedTo("Admin", "Student"),
    adminController.getStudentFullProfile
  );
router
  .route("/teacher/:id/full-profile")
  .get(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    adminController.getTeacherFullProfile
  );
router
  .route("/classroom/:id/full-profile")
  .get(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    adminController.getClassroomFullProfile
  );

// routes/student.routes.js
router
  .route("/timetableStudent/:studentId")
  .get(
    verifyToken,
    allowedTo("Admin", "Student"),
    timetableController.getTimetableByStudentId
  );

// routes/teacher.routes.js
router
  .route("/timetableTeacher/:teacherId")
  .get(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    timetableController.getTimetableByTeacherId
  );

module.exports = router;
