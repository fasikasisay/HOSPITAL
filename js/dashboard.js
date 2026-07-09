if(!localStorage.getItem("loggedIn")){
    window.location.href = "login.html";
}

let patients = [];

async function loadPatients() {
    try {
        const response = await fetch("http://localhost:5000/patients");
        patients = await response.json();

        renderPatients();
    } catch (error) {
        console.error("Error loading patients:", error);
    }
}
table.innerHTML += `
<tr>
    <td>${patient.token}</td>
    <td>${patient.name}</td>
    <td>${patient.urgency}</td>
    <td>${patient.status}</td>
    <td>
        <button onclick="servePatient(${patient.id})">
            Serve
        </button>

        <button onclick="completePatient(${patient.id})">
            Complete
        </button>

        <button onclick="removePatient(${patient.id})">
            Remove
        </button>
    </td>
</tr>
`;
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
function savePatients() {
    localStorage.setItem("patients", JSON.stringify(patients));
}
async function servePatient(id) {
    await fetch(
        `http://localhost:5000/patients/${id}/serve`,
        {
            method: "PUT"
        }
    );

    loadPatients();
}

async function completePatient(id) {
    await fetch(
        `http://localhost:5000/patients/${id}/complete`,
        {
            method: "PUT"
        }
    );

    loadPatients();
}

async function removePatient(id) {
    await fetch(
        `http://localhost:5000/patients/${id}`,
        {
            method: "DELETE"
        }
    );

    loadPatients();
}

document.getElementById("logoutBtn")
.addEventListener("click",()=>{

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");

    window.location.href="login.html";
});

loadPatients();