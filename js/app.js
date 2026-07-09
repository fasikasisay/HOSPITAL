let patients = JSON.parse(localStorage.getItem("patients")) || [];

document.getElementById("patientForm")
.addEventListener("submit", async function(e) {

    e.preventDefault();

    const patient = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value,
        reason: document.getElementById("reason").value,
        urgency: document.getElementById("urgency").value
    };

    try {

        const response = await fetch(
            "http://localhost:5000/patients",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(patient)
            }
        );

        const data = await response.json();

        document.getElementById("result").innerHTML = `
            <h3>Registration Successful</h3>
            <p><strong>Token:</strong> ${data.token}</p>
            <p><strong>Status:</strong> ${data.status}</p>
        `;

        document.getElementById("result")
            .classList.remove("hidden");

        this.reset();

    } catch (error) {
        console.error(error);
        alert("Failed to connect to server");
    }
});