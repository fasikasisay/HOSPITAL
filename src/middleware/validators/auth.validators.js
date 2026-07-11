const { body } = require("express-validator");
const { checkValidation } = require("./patient.validators");

const loginRules = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required."),

    body("password")
        .notEmpty().withMessage("Password is required."),

    checkValidation,
];

module.exports = { loginRules };
