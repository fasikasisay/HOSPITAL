const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

// Centralized, validated configuration. Every other module reads
// settings from here instead of touching process.env directly, so
// there is exactly one place to change when moving between
// environments (local, staging, production).
const required = (name, fallback) => {
    const value = process.env[name] ?? fallback;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

const config = {
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5000,

    // Comma-separated list of allowed origins. Defaults to "*" so the
    // existing frontend (opened from a static server or file://) keeps
    // working out of the box; tighten this in production via .env.
    corsOrigins: (process.env.CORS_ORIGINS || "*")
        .split(",")
        .map((origin) => origin.trim()),

    jwt: {
        secret: required("JWT_SECRET", "dev-only-secret-change-me"),
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    },

    rateLimit: {
        loginWindowMs: 15 * 60 * 1000,
        loginMax: 10,
    },
};

if (config.env === "production" && config.jwt.secret === "dev-only-secret-change-me") {
    // Fail loudly rather than silently running production on a known secret.
    throw new Error(
        "JWT_SECRET must be set to a strong, unique value in production. " +
        "Set it in your environment or .env file."
    );
}

module.exports = config;
