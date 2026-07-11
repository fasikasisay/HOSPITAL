const config = require("../config/env");

/**
 * Catches everything thrown or passed to next(err) anywhere in the
 * app. Operational errors (AppError) are shown to the client as-is;
 * anything unexpected is logged and returned as a generic 500 so
 * internals are never leaked to callers.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    const statusCode = err.isOperational ? err.statusCode : 500;
    const message = err.isOperational ? err.message : "Something went wrong on our end.";

    if (!err.isOperational) {
        console.error("Unexpected error:", err);
    }

    const body = {
        status: "error",
        message,
    };

    if (err.details) body.errors = err.details;
    if (config.env === "development" && !err.isOperational) body.stack = err.stack;

    res.status(statusCode).json(body);
}

module.exports = errorHandler;
