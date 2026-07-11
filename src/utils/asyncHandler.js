/**
 * Wraps an async route handler so any rejected promise is forwarded
 * to Express's error-handling middleware via next(), instead of
 * requiring a try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
