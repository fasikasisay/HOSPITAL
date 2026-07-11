/**
 * Patient data access layer.
 *
 * This currently keeps patients in memory, exactly like the original
 * prototype backend. It's deliberately shaped as a small repository
 * (create/findAll/findById/update/remove) so that swapping in a real
 * database later — Postgres, MongoDB, etc. — only means rewriting the
 * function bodies in this one file. Controllers never touch the
 * underlying array directly, so nothing above this layer needs to
 * change when that migration happens.
 */

let patients = [];
let nextId = 1;
let nextTokenNumber = 1;

function formatToken(number) {
    return String(number).padStart(3, "0");
}

function findAll() {
    return patients;
}

function findById(id) {
    return patients.find((p) => p.id === Number(id));
}

function create(data) {
    const patient = {
        id: nextId++,
        token: formatToken(nextTokenNumber++),
        name: data.name,
        age: data.age,
        gender: data.gender,
        phone: data.phone,
        reason: data.reason,
        urgency: data.urgency,
        status: "Waiting",
        createdAt: new Date().toISOString(),
        servedAt: null,
        completedAt: null,
    };

    patients.push(patient);
    return patient;
}

function updateStatus(id, status) {
    const patient = findById(id);
    if (!patient) return null;

    patient.status = status;
    if (status === "Serving") patient.servedAt = new Date().toISOString();
    if (status === "Completed") patient.completedAt = new Date().toISOString();

    return patient;
}

function remove(id) {
    const index = patients.findIndex((p) => p.id === Number(id));
    if (index === -1) return false;

    patients.splice(index, 1);
    return true;
}

function getStatusSummary() {
    return {
        total: patients.length,
        waiting: patients.filter((p) => p.status === "Waiting").length,
        serving: patients.filter((p) => p.status === "Serving").length,
        completed: patients.filter((p) => p.status === "Completed").length,
    };
}

/** Testing/reset helper — not used by the API itself. */
function _reset() {
    patients = [];
    nextId = 1;
    nextTokenNumber = 1;
}

module.exports = {
    findAll,
    findById,
    create,
    updateStatus,
    remove,
    getStatusSummary,
    _reset,
};
