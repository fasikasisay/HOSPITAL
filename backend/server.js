const app = require("./src/app");
const config = require("./src/config/env");

const server = app.listen(config.port, () => {
    console.log(`Hospital Queue API listening on port ${config.port} [${config.env}]`);
});

// Fail fast and loudly on unhandled rejections instead of leaving the
// process in a broken state.
process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection:", err);
    server.close(() => process.exit(1));
});

module.exports = server;
 