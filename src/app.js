const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const config = require("./config/env");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security headers.
app.use(helmet());

// CORS — origin list is configurable via CORS_ORIGINS in .env;
// defaults to "*" so the existing frontend keeps working unchanged.
app.use(
    cors({
        origin: config.corsOrigins.includes("*") ? true : config.corsOrigins,
    })
);

app.use(express.json());

if (config.env !== "test") {
    app.use(morgan(config.env === "production" ? "combined" : "dev"));
}

// All routes are mounted at the root to stay compatible with the
// existing frontend, which calls e.g. http://localhost:5000/patients
// rather than a versioned /api prefix.
app.use("/", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
