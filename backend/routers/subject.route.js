const express = require("express");
const SubjectrController = require("../controllers/subjects/subjects.controller");
const { validateUser } = require("../middlewares/validations/user.validation");
const router = express.Router();

const allowedTo = require("../middlewares/allowedTo");
const verifyToken = require("../middlewares/verfiyToken");

router
  .route("/")
  .get(verifyToken, allowedTo("Admin"), SubjectrController.getAllSubjects);
router
  .route("/addNewSubject")
  .post(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    SubjectrController.createSubject
  );
router
  .route("/:id")
  .get(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    SubjectrController.getSubjectById
  )
  .put(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    SubjectrController.updateSubject
  )
  .delete(
    verifyToken,
    allowedTo("Admin", "Teacher"),
    SubjectrController.deleteSubject
  );

module.exports = router;
