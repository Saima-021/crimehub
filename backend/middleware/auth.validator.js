const { body } = require("express-validator");


const registerValidator = [

  body("fullName")
    .trim()
    .matches(/^[A-Za-z ]{3,50}$/)
    .withMessage("Full name must be 3-50 letters only"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("phone")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Phone must be 10-15 digits"),

  body("dateOfBirth")
    .isISO8601()
    .withMessage("Invalid date format (YYYY-MM-DD)")
    .custom((value) => {
      const today = new Date();
      const birthDate = new Date(value);

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        throw new Error("You must be at least 18 years old");
      }

      return true;
    }),

  body("password")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .withMessage("Password must include uppercase, lowercase, number and special character"),

  body("state")
    .notEmpty()
    .withMessage("State is required"),
    body("city")
    .notEmpty()
    .withMessage("city is required"),

];

const loginValidator = [

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")

];

module.exports = { registerValidator, loginValidator };

