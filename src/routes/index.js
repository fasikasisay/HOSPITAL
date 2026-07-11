const express = require("express");
const patientsRoutes = require("./patients.routes");
const authRoutes = require("./auth.routes");
const queueRoutes = require("./queue.routes");

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({ status: "success", message: "Hospital Queue API is running." });
});

router.use("/patients", patientsRoutes);
router.use("/auth", authRoutes);
router.use("/queue", queueRoutes);

module.exports = router;
