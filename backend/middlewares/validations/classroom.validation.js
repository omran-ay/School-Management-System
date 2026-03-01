const { body } = require("express-validator");

const validateClassroomCreate = () => [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 characters long"),

  body("grade_id")
    .notEmpty()
    .withMessage("grade is required")
    .isInt()
    .withMessage("grade_id must be an integer"),

  body("academic_year")
    .notEmpty()
    .withMessage("academic_year is required")
    .isLength({ min: 4 })
    .withMessage("academic_year must be at least 4 characters long"),

  body("max_students")
    .optional()
    .isInt({ min: 1 })
    .withMessage("max_students must be an integer greater than 0"),

  body("min_students")
    .optional()
    .isInt({ min: 0 })
    .withMessage("min_students must be an integer greater than or equal to 0"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "archived"])
    .withMessage("status must be one of: active, inactive, archived"),

  body("teacher_id")
    .optional()
    .isInt()
    .withMessage("teacher_id must be an integer"),
];

const validateClassroomUpdate = () => [
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 characters long"),

  body("grade_id")
    .optional()
    .isInt()
    .withMessage("grade_id must be an integer"),

  body("academic_year")
    .optional()
    .isLength({ min: 4 })
    .withMessage("academic_year must be at least 4 characters long"),

  body("max_students")
    .optional()
    .isInt({ min: 1 })
    .withMessage("max_students must be an integer greater than 0"),

  body("min_students")
    .optional()
    .isInt({ min: 0 })
    .withMessage("min_students must be an integer greater than or equal to 0"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "archived"])
    .withMessage("status must be one of: active, inactive, archived"),

  body("teacher_id")
    .optional()
    .isInt()
    .withMessage("teacher_id must be an integer"),
];

module.exports = {
  validateClassroomCreate,
  validateClassroomUpdate,
};
