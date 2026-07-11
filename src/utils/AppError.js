/**
 * Operational error type for anything we throw on purpose (bad input,
 * missing resource, auth failure). The global error handler uses
 * `isOperational` to decide whether to show the message to the client
 * or fall back to a generic "something went wrong".
 */
class AppError extends Error {
    constructor(message, statusCode = 500, details = undefined) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.isOperational = true;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
