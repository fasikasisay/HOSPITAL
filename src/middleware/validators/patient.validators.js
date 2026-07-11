const { body, param, validationResult } = require("express-validator");
const AppError = require("../../utils/AppError");

const URGENCY_VALUES = ["Critical", "High", "Normal", "Low"];
const GENDER_VALUES = ["Male", "Female"];

/** Turns express-validator's result into a single AppError with details. */
function checkValidation(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const details = result.array().map((e) => ({ field: e.path, message: e.msg }));
        throw new AppError("Please check the submitted information.", 400, details);
    }
    next();
}

const registerPatientRules = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required.")
        .isLength({ max: 100 }).withMessage("Name is too long."),

    body("age")
        .notEmpty().withMessage("Age is required.")
        .isInt({ min: 0, max: 130 }).withMessage("Age must be a number between 0 and 130.")
        .toInt(),

    body("gender")
        .trim()
        .notEmpty().withMessage("Gender is required.")
        .isIn(GENDER_VALUES).withMessage(`Gender must be one of: ${GENDER_VALUES.join(", ")}.`),

    body("phone")
        .trim()
        .notEmpty().withMessage("Phone number is required.")
        .isLength({ min: 5, max: 20 }).withMessage("Phone number looks invalid.")
        .matches(/^[0-9+\-()\s]+$/).withMessage("Phone number contains invalid characters."),

    body("reason")
        .trim()
        .notEmpty().withMessage("Reason for visit is required.")
        .isLength({ max: 500 }).withMessage("Reason is too long."),

    body("urgency")
        .trim()
        .notEmpty().withMessage("Urgency level is required.")
        .isIn(URGENCY_VALUES).withMessage(`Urgency must be one of: ${URGENCY_VALUES.join(", ")}.`),

    checkValidation,
];

const patientIdParamRules = [
    param("id")
        .notEmpty().withMessage("Patient id is required.")
        .isInt({ min: 1 }).withMessage("Patient id must be a positive number."),

    checkValidation,
];

module.exports = { registerPatientRules, patientIdParamRules, checkValidation };
