const express = require("express");
const {
    registerPatient,
    getAllPatients,
    servePatient,
    completePatient,
    deletePatient,
} = require("../controllers/patients.controller");
const { registerPatientRules, patientIdParamRules } = require("../middleware/validators/patient.validators");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Public — patients register themselves from the kiosk, no login needed.
router.post("/", registerPatientRules, registerPatient);

// Protected — staff dashboard only.
router.get("/", requireAuth, getAllPatients);
router.put("/:id/serve", requireAuth, requireRole("staff", "admin"), patientIdParamRules, servePatient);
router.put("/:id/complete", requireAuth, requireRole("staff", "admin"), patientIdParamRules, completePatient);

// Destructive — admin only.
router.delete("/:id", requireAuth, requireRole("admin"), patientIdParamRules, deletePatient);

module.exports = router;
