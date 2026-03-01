const express = require("express");
const router = express.Router();
const timetableController = require("../controllers/timetable/timetable.controller");
const allowedTo = require("../middlewares/allowedTo");
const verifyToken = require("../middlewares/verfiyToken");

router
  .route("/")
  .get(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    timetableController.getAllTimetables
  );

router
  .route("/Createtimetable")
  .post(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    timetableController.createTimetable
  );

router
  .route("/timetable/:id")
  .get(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    timetableController.getTimetableById
  )
  .put(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    timetableController.updateTimetable
  )
  .delete(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    timetableController.deleteTimetable
  );

module.exports = router;
