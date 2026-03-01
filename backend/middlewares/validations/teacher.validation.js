const { body } = require("express-validator");

const validateTeacherOnCreate = () => [
  // First Name
  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("First name must contain only letters"),

  // Last Name
  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Last name must contain only letters"),

  // Birth Date
  body("birth_date")
    .notEmpty()
    .withMessage("Birth date is required")
    .isISO8601()
    .withMessage("Birth date must be a valid date"),

  // Gender
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female"])
    .withMessage("Gender must be either 'male' or 'female'"),

  // Marital Status
  body("marital_status")
    .optional()
    .isIn(["single", "married", "divorced", "widowed"])
    .withMessage("Invalid marital status"),

  // Nationality
  body("nationality")
    .notEmpty()
    .withMessage("Nationality is required")
    .isString()
    .withMessage("Nationality must be a string"),

  // Teacher Code
  body("teacher_code").notEmpty().withMessage("Teacher code is required"),

  // Specialization
  body("specialization")
    .notEmpty()
    .withMessage("Specialization is required")
    .isString()
    .withMessage("Specialization must be a string"),

  // Years of Experience
  body("years_of_experience")
    .notEmpty()
    .withMessage("Years of experience is required")
    .isInt({ min: 0 })
    .withMessage("Years of experience must be a positive number"),

  // Highest Qualification
  body("highest_qualification")
    .notEmpty()
    .withMessage("Highest qualification is required")
    .isString()
    .withMessage("Qualification must be a string"),

  body("date_of_hire")
    .notEmpty()
    .withMessage("Date of hire is required")
    .isISO8601()
    .withMessage("Date of hire must be a valid date"),

  body("salary_grade").notEmpty().withMessage("Salary grade is required"),

  body("phone_number")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5 })
    .withMessage("Address is too short"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be strong (8+ chars, upper/lower case, number, symbol)",
    ),
];

// عند التعديل
const validateTeacherOnUpdate = () => [
  body("first_name")
    .optional()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("First name must contain only letters"),

  body("last_name")
    .optional()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Last name must contain only letters"),

  body("birth_date")
    .optional()
    .isISO8601()
    .withMessage("Birth date must be a valid date"),

  body("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("Gender must be either 'male' or 'female'"),

  body("marital_status")
    .optional()
    .isIn(["single", "married", "divorced", "widowed"])
    .withMessage("Invalid marital status"),

  body("nationality")
    .optional()
    .isString()
    .withMessage("Nationality must be a string"),

  body("teacher_code").optional(),

  body("specialization")
    .optional()
    .isString()
    .withMessage("Specialization must be a string"),

  body("years_of_experience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Years of experience must be a positive number"),

  body("highest_qualification")
    .optional()
    .isString()
    .withMessage("Qualification must be a string"),

  body("date_of_hire")
    .optional()
    .isISO8601()
    .withMessage("Date of hire must be a valid date"),

  body("salary_grade").optional(),

  body("phone_number")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  body("email").optional().isEmail().withMessage("Invalid email address"),

  body("address")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Address is too short"),

  body("password")
    .optional()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be strong (8+ chars, upper/lower case, number, symbol)",
    ),
];

module.exports = {
  validateTeacherOnCreate,
  validateTeacherOnUpdate,
};
