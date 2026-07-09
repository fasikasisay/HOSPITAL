const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let patients = [];

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Hospital Queue API is running"
    });
});

// Get all patients
app.get("/patients", (req, res) => {
    res.json(patients);
});

// Add patient
app.post("/patients", (req, res) => {
    const patient = {
        id: Date.now(),
        token: String(patients.length + 1).padStart(3, "0"),
        ...req.body,
        status: "Waiting"
    };

    patients.push(patient);

    res.status(201).json(patient);
});
app.put("/patients/:id/serve", (req, res) => {
    const patient = patients.find(
        p => p.id == req.params.id
    );

    if (!patient) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    patient.status = "Serving";

    res.json(patient);
});

app.put("/patients/:id/complete", (req, res) => {
    const patient = patients.find(
        p => p.id == req.params.id
    );

    if (!patient) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    patient.status = "Completed";

    res.json(patient);
});

app.delete("/patients/:id", (req, res) => {
    patients = patients.filter(
        p => p.id != req.params.id
    );

    res.json({
        message: "Patient removed"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});