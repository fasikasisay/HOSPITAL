const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../utils/token");

/**
 * Verifies the Bearer token on protected routes and attaches the
 * decoded user (`{ username, role }`) to `req.user`.
 */
const requireAuth = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new AppError("Authentication required. Please log in.", 401);
    }

    try {
        const decoded = verifyToken(token);
        req.user = { username: decoded.username, role: decoded.role };
        next();
    } catch (err) {
        throw new AppError("Your session has expired. Please log in again.", 401);
    }
});

/**
 * Restricts a route to one or more roles. Must run after requireAuth.
 * Usage: requireRole("admin") or requireRole("admin", "staff")
 */
const requireRole = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        throw new AppError("Authentication required. Please log in.", 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
        throw new AppError("You don't have permission to perform this action.", 403);
    }
    next();
};

module.exports = { requireAuth, requireRole };
