const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { findUserByUsername } = require("../config/credentials");
const { signToken } = require("../utils/token");

/**
 * POST /auth/login
 * Public. Verifies credentials against the staff/admin account list
 * and returns a signed JWT the frontend attaches to subsequent
 * requests as `Authorization: Bearer <token>`.
 */
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = findUserByUsername(username);
    const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !passwordMatches) {
        throw new AppError("Invalid username or password.", 401);
    }

    const token = signToken({ username: user.username, role: user.role });

    res.json({
        status: "success",
        token,
        user: { username: user.username, role: user.role },
    });
});

/**
 * POST /auth/logout
 * Protected. JWTs are stateless, so there is nothing to invalidate
 * server-side without a token blacklist/store — logging out is
 * primarily a client-side action (discard the token). This endpoint
 * exists so the frontend has a real call to make, and so a token
 * blacklist can be added here later without changing the frontend.
 */
const logout = asyncHandler(async (req, res) => {
    res.json({ status: "success", message: "Logged out." });
});

/**
 * GET /auth/me
 * Protected. Lets the dashboard verify a stored token is still valid
 * on page load, instead of trusting localStorage blindly.
 */
const me = asyncHandler(async (req, res) => {
    res.json({ status: "success", user: req.user });
});

module.exports = { login, logout, me };
