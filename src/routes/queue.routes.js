const express = require("express");
const { getQueueStatus } = require("../controllers/patients.controller");

const router = express.Router();

// Public — safe for a waiting-room display board, no PII exposed.
router.get("/status", getQueueStatus);

module.exports = router;
