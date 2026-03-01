const express = require("express");
const ClassroomsController = require("../controllers/classrooms/class.controller");

const validateClassroom = require("../middlewares/validations/classroom.validation");

const allowedTo = require("../middlewares/allowedTo");
const verifyToken = require("../middlewares/verfiyToken");

const router = express.Router();

//classes
router
  .route("/")
  .get(verifyToken, allowedTo("Admin"), ClassroomsController.getAllClassrooms);
router
  .route("/addNewClassroom")
  .post(
    validateClassroom.validateClassroomCreate(),
    verifyToken,
    allowedTo("Admin"),
    ClassroomsController.addNewClassrooms
  );

router
  .route("/:classId")
  .get(verifyToken, allowedTo("Admin"), ClassroomsController.GetSingleClassroom)
  .patch(
    validateClassroom.validateClassroomUpdate(),
    verifyToken,
    allowedTo("Admin"),
    ClassroomsController.UpdateClassrooms
  )
  .delete(
    verifyToken,
    allowedTo("Admin"),
    ClassroomsController.DeleteClassrooms
  );

module.exports = router;
