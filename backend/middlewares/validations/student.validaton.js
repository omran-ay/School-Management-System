const { body } = require("express-validator");

const validateStudent = () => [
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

  // Phone Number
  body("phone_number")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  // Address
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5 })
    .withMessage("Address is too short"),

  // Parent Email
  body("parents_email")
    .optional()
    .isEmail()
    .withMessage("Invalid parent email"),

  // Student Number
  body("student_number").notEmpty().withMessage("Student number is required"),

  // Password
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
      "Password must be strong (8+ chars, upper/lower case, number, symbol)"
    ),

  // Registration Date
  body("registration_date")
    .optional()
    .isISO8601()
    .withMessage("Registration date must be a valid date"),
];

module.exports = {
  validateStudent,
};
