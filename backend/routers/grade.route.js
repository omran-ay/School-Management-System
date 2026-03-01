const express = require("express");
const router = express.Router();
const gradesController = require("../controllers/grades/grades.controller");

const allowedTo = require("../middlewares/allowedTo");
const verifyToken = require("../middlewares/verfiyToken");

router
  .route("/")
  .get(verifyToken, allowedTo("Admin"), gradesController.getAllGrades);

router
  .route("/AddNewGrade")
  .post(verifyToken, allowedTo("Admin", "Teacher"), gradesController.addGrade);

router
  .route("/:id")
  .get(
    verifyToken,
    allowedTo("Admin", "Teacher", "Student"),
    gradesController.getGradeById
  )
  .put(verifyToken, allowedTo("Admin", "Teacher"), gradesController.updateGrade)
  .delete(verifyToken, allowedTo("Admin"), gradesController.deleteGrade);

module.exports = router;
