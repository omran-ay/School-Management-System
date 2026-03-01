const express = require("express");
const router = express.Router();
const {
  createGradeLevel,
  getAllGradeLevels,
  getGradeLevelById,
  updateGradeLevel,
  deleteGradeLevel,
} = require("../controllers/gradesClassrooms/gradesClassrooms.controller");

router.route("/").get(getAllGradeLevels);
router.route("/addNewGradesLevel").post(createGradeLevel);
router
  .route("/:id")
  .get(getGradeLevelById)
  .put(updateGradeLevel)
  .delete(deleteGradeLevel);

module.exports = router;
