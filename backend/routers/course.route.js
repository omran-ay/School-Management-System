const express = require("express");
const router = express.Router();
const CourseController = require("../controllers/courses/courses.controller");
const allowedTo = require("../middlewares/allowedTo");
const verifyToken = require("../middlewares/verfiyToken");

router
  .route("/")
  .get(verifyToken, allowedTo("Admin"), CourseController.getAllCourses);

router
  .route("/addNewCourse")
  .post(verifyToken, allowedTo("Admin"), CourseController.createCourse);
router
  .route("/:id")
  .get(verifyToken, allowedTo("Admin"), CourseController.getCourseById)
  .patch(verifyToken, allowedTo("Admin"), CourseController.updateCourse)
  .delete(verifyToken, allowedTo("Admin"), CourseController.deleteCourse);

module.exports = router;
