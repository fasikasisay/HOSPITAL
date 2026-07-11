const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const patientStore = require("../models/patientStore");
const { sortQueue } = require("../utils/priority");

/**
 * POST /patients
 * Public — anyone can join the queue from the registration kiosk,
 * no staff login required.
 */
const registerPatient = asyncHandler(async (req, res) => {
    const { name, age, gender, phone, reason, urgency } = req.body;

    const patient = patientStore.create({ name, age, gender, phone, reason, urgency });

    res.status(201).json(patient);
});

/**
 * GET /patients
 * Protected (staff/admin). Returns every patient ordered by the
 * priority queue rules: currently-served first, then waiting
 * patients by urgency (Critical > High > Normal > Low) and arrival
 * time, then completed patients.
 */
const getAllPatients = asyncHandler(async (req, res) => {
    const patients = sortQueue(patientStore.findAll());
    res.json(patients);
});

/**
 * GET /queue/status
 * Public — a lightweight summary safe to show on a waiting-room
 * display without exposing individual patient details.
 */
const getQueueStatus = asyncHandler(async (req, res) => {
    res.json(patientStore.getStatusSummary());
});

const findPatientOr404 = (id) => {
    const patient = patientStore.findById(id);
    if (!patient) {
        throw new AppError(`No patient found with id ${id}.`, 404);
    }
    return patient;
};

/**
 * PUT /patients/:id/serve
 * Protected (staff/admin).
 */
const servePatient = asyncHandler(async (req, res) => {
    findPatientOr404(req.params.id);
    const patient = patientStore.updateStatus(req.params.id, "Serving");
    res.json(patient);
});

/**
 * PUT /patients/:id/complete
 * Protected (staff/admin).
 */
const completePatient = asyncHandler(async (req, res) => {
    findPatientOr404(req.params.id);
    const patient = patientStore.updateStatus(req.params.id, "Completed");
    res.json(patient);
});

/**
 * DELETE /patients/:id
 * Protected (admin only) — removing a patient record entirely is
 * destructive, so it's restricted beyond regular staff actions.
 */
const deletePatient = asyncHandler(async (req, res) => {
    findPatientOr404(req.params.id);
    patientStore.remove(req.params.id);
    res.json({ status: "success", message: "Patient removed." });
});

module.exports = {
    registerPatient,
    getAllPatients,
    getQueueStatus,
    servePatient,
    completePatient,
    deletePatient,
};
