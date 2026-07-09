let patients = JSON.parse(localStorage.getItem("patients")) || [];

document.getElementById("patientForm")
.addEventListener("submit", function(e) {
    e.preventDefault();

    const patient = {
        token: String(patients.length + 1).padStart(3, "0"),
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value,
        reason: document.getElementById("reason").value,
        urgency: document.getElementById("urgency").value,
        status: "Waiting"
    };

    patients.push(patient);

    localStorage.setItem("patients", JSON.stringify(patients));

    document.getElementById("result").innerHTML = `
        <h3>Registration Successful</h3>
        <p>Token Number: ${patient.token}</p>
        <p>Queue Position: ${patients.length}</p>
        <p>Estimated Waiting Time: ${patients.length * 5} minutes</p>
    `;

    document.getElementById("result").classList.remove("hidden");

    this.reset();
});