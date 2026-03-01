const express = require("express");
const router = express.Router();
const studnetContorller = require("../controllers/students/students.controller");
const {
  validateStudent,
} = require("../middlewares/validations/student.validaton");

const allowedTo = require("../middlewares/allowedTo");
const verifyToken = require("../middlewares/verfiyToken");

//students
router
  .route("/")
  .get(verifyToken, allowedTo("Admin"), studnetContorller.getAllStudents);
router
  .route("/addNewStudent")
  .post(
    validateStudent(),
    verifyToken,
    allowedTo("Admin"),
    studnetContorller.addNewStudent
  );
router
  .route("/:studentId")
  .get(verifyToken, studnetContorller.GetSingleStudent)
  .patch(verifyToken, allowedTo("Admin"), studnetContorller.UpdateStudnet)
  .delete(verifyToken, allowedTo("Admin"), studnetContorller.DeleteStudnet);

module.exports = router;
