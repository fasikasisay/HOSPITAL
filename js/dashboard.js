if(!localStorage.getItem("loggedIn")){
    window.location.href = "login.html";
}

let patients = JSON.parse(localStorage.getItem("patients")) || [];

function renderPatients(){

    const table =
        document.getElementById("patientTable");

    table.innerHTML = "";

    patients.forEach((patient,index)=>{

        table.innerHTML += `
            <tr>
                <td>${patient.token}</td>
                <td>${patient.name}</td>
                <td>${patient.urgency}</td>
                <td>${patient.status}</td>
                <td>
                    <button onclick="servePatient(${index})">
                        Serve
                    </button>

                    <button onclick="completePatient(${index})">
                        Complete
                    </button>

                    <button onclick="removePatient(${index})">
                        Remove
                    </button>
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
function savePatients() {
    localStorage.setItem("patients", JSON.stringify(patients));
}
function servePatient(index){
    patients[index].status = "Serving";
    savePatients();
    renderPatients();
}

function completePatient(index){
    patients[index].status = "Completed";
   savePatients();
    renderPatients();
}

function removePatient(index){
    patients.splice(index,1);
    savePatients();
    renderPatients();
}

document.getElementById("logoutBtn")
.addEventListener("click",()=>{

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");

    window.location.href="login.html";
});

renderPatients();