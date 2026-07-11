const API_BASE = "http://localhost:5000";

if (!localStorage.getItem("loggedIn") || !localStorage.getItem("token")) {
    window.location.href = "login.html";
}

let patients = [];
const currentRole = localStorage.getItem("role");

function authHeaders() {
    return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}
 
/** Centralized session handling: if the token is missing/expired or
 *  the current role isn't permitted, send the user back to login
 *  rather than leaving them looking at a broken dashboard. */
function handleAuthFailure(status) {
    if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("role");
        window.location.href = "login.html";
        return true;
    }
    return false;
}

// ---------- Cosmetic helpers (urgency/status badges, avatar) ----------

function urgencyBadgeClass(urgency) {
    switch (urgency) {
        case "Critical": return "badge-critical";
        case "High": return "badge-high";
        case "Normal": return "badge-normal";
        case "Low": return "badge-low";
        default: return "badge-normal";
    }
}

function statusBadgeClass(status) {
    switch (status) {
        case "Waiting": return "badge-waiting";
        case "Serving": return "badge-serving";
        case "Completed": return "badge-completed";
        default: return "badge-waiting";
    }
}

function initialsFrom(text) {
    if (!text) return "ST";
    return text.trim().slice(0, 2).toUpperCase();
}

(function renderStaffChip() {
    const roleEl = document.getElementById("avatarRole");
    const initialsEl = document.getElementById("avatarInitials");
    if (roleEl && currentRole) roleEl.textContent = currentRole;
    if (initialsEl) initialsEl.textContent = initialsFrom(currentRole);
})();

// ---------- Mobile sidebar toggle (cosmetic only) ----------

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");

function openSidebar() {
    document.body.classList.add("sidebar-open");
}
function closeSidebar() {
    document.body.classList.remove("sidebar-open");
}

if (menuToggle) menuToggle.addEventListener("click", openSidebar);
if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeSidebar);

// ---------- Core queue logic ----------

async function loadPatients() {
    try {
        const response = await fetch(`${API_BASE}/patients`, {
            headers: authHeaders(),
        });

        if (handleAuthFailure(response.status)) return;

        patients = await response.json();
        renderPatients();
    } catch (error) {
        console.error("Error loading patients:", error);
    }
}

function renderPatients() {
    const table = document.getElementById("patientTable");
    // Deleting a patient is restricted to admins on the backend;
    // only show the control to roles that can actually use it.
    const canDelete = currentRole === "admin";

    table.innerHTML = "";

    if (patients.length === 0) {
        table.innerHTML = `
        <tr>
            <td colspan="5">
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    <h3>No patients in the queue</h3>
                    <p>New registrations will appear here automatically.</p>
                </div>
            </td>
        </tr>
        `;
        updateStats();
        return;
    }

    patients.forEach((patient) => {
        table.innerHTML += `
        <tr>
            <td><span class="ticket-token">${patient.token}</span></td>
            <td class="patient-name">
                ${patient.name}
                <span class="patient-sub">${patient.age ? patient.age + " yrs · " : ""}${patient.gender || ""}</span>
            </td>
            <td><span class="badge ${urgencyBadgeClass(patient.urgency)}">${patient.urgency}</span></td>
            <td><span class="badge ${statusBadgeClass(patient.status)}">${patient.status}</span></td>
            <td>
                <div class="row-actions">
                    <button class="btn-icon action-serve" title="Serve" onclick="servePatient(${patient.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3l14 9-14 9V3z"/></svg>
                    </button>

                    <button class="btn-icon action-complete" title="Complete" onclick="completePatient(${patient.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </button>

                    ${canDelete ? `
                    <button class="btn-icon action-remove" title="Remove" onclick="removePatient(${patient.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0-1 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 6"/></svg>
                    </button>
                    ` : ""}
                </div>
            </td>
        </tr>
        `;
    });

    updateStats();
}

function updateStats(){

    document.getElementById("totalPatients").innerText =
        patients.length;

    document.getElementById("waitingPatients").innerText =
        patients.filter(p=>p.status==="Waiting").length;

    document.getElementById("servingPatients").innerText =
        patients.filter(p=>p.status==="Serving").length;

    document.getElementById("completedPatients").innerText =
        patients.filter(p=>p.status==="Completed").length;
}

async function servePatient(id) {
    const response = await fetch(
        `${API_BASE}/patients/${id}/serve`,
        { method: "PUT", headers: authHeaders() }
    );

    if (handleAuthFailure(response.status)) return;
    if (!response.ok) {
        console.error("Failed to serve patient", await response.json().catch(() => ({})));
        return;
    }

    loadPatients();
}

async function completePatient(id) {
    const response = await fetch(
        `${API_BASE}/patients/${id}/complete`,
        { method: "PUT", headers: authHeaders() }
    );

    if (handleAuthFailure(response.status)) return;
    if (!response.ok) {
        console.error("Failed to complete patient", await response.json().catch(() => ({})));
        return;
    }

    loadPatients();
}

async function removePatient(id) {
    const response = await fetch(
        `${API_BASE}/patients/${id}`,
        { method: "DELETE", headers: authHeaders() }
    );

    if (handleAuthFailure(response.status)) return;
    if (!response.ok) {
        console.error("Failed to remove patient", await response.json().catch(() => ({})));
        return;
    }

    loadPatients();
}

document.getElementById("logoutBtn")
.addEventListener("click", async () => {

    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: "POST",
            headers: authHeaders(),
        });
    } catch (error) {
        console.error("Logout request failed:", error);
    }

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    window.location.href="login.html";
});

loadPatients();
