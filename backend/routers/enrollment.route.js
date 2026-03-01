const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollments/enrollment.controller");

router.route("/").get(enrollmentController.getAllEnrollments);

router.route("/enrollStudent").post(enrollmentController.enrollStudent);

router
  .route("/:id")
  .get(enrollmentController.getEnrollmentById)
  .put(enrollmentController.updateEnrollment)
  .delete(enrollmentController.deleteEnrollment);

module.exports = router;
