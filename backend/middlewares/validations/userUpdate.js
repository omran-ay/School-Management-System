// validateUserUpdate.js
const { body } = require("express-validator");

const validateUserUpdate = () => {
  return [
    body("first_name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be 2-50 characters")
      .matches(/^[A-Za-zأ-ي\s\-']+$/)
      .withMessage("First name contains invalid characters"),

    body("last_name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be 2-50 characters")
      .matches(/^[A-Za-zأ-ي\s\-']+$/)
      .withMessage("Last name contains invalid characters"),

    body("email").optional().isEmail().withMessage("Email is not valid"),

    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[@$!%*?&]/)
      .withMessage("Password must contain at least one special character"),
  ];
};

module.exports = { validateUserUpdate };
