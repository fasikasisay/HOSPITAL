const express = require("express");
const rateLimit = require("express-rate-limit");
const { login, logout, me } = require("../controllers/auth.controller");
const { loginRules } = require("../middleware/validators/auth.validators");
const { requireAuth } = require("../middleware/auth");
const config = require("../config/env");

const router = express.Router();

// Slows down brute-force attempts against staff credentials.
const loginLimiter = rateLimit({
    windowMs: config.rateLimit.loginWindowMs,
    max: config.rateLimit.loginMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: "error",
        message: "Too many login attempts. Please try again later.",
    },
});

router.post("/login", loginLimiter, loginRules, login);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);

module.exports = router;
