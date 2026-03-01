const { body } = require("express-validator");

const ValidationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLatLong({ min: 2 })
      .withMessage("title at least tow digits"),
    body("price").notEmpty().withMessage("price is required"),
  ];
};

module.exports = ValidationSchema;
