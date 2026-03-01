const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance/attendance.controller");

router.route("/").get(attendanceController.getAllAttendance);

router.route("/AddNweAttendace").post(attendanceController.markAttendance);
router
  .route("/:id")
  .get(attendanceController.getAttendanceById)
  .put(attendanceController.updateAttendance)
  .delete(attendanceController.deleteAttendance);

module.exports = router;
