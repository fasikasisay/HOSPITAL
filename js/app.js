let patients = JSON.parse(localStorage.getItem("patients")) || [];

// Cosmetic only: color the urgency select to match the chosen level.
const urgencySelect = document.getElementById("urgency");
if (urgencySelect) {
    urgencySelect.addEventListener("change", function () {
        urgencySelect.classList.remove(
            "urgency-Critical", "urgency-High", "urgency-Normal", "urgency-Low"
        );
        if (this.value) {
            urgencySelect.classList.add("urgency-" + this.value);
        }
    });
}
 
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

    const submitBtn = this.querySelector("button[type='submit']");
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : null;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Joining queue…";
    }

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
            <div class="result-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h3>Registration successful</h3>
            <p>Your queue token</p>
            <div class="ticket-token ticket-token-lg">${data.token}</div>
            <p><strong>Status:</strong> ${data.status}</p>
        `;

        document.getElementById("result")
            .classList.remove("hidden");

        this.reset();
        if (urgencySelect) {
            urgencySelect.classList.remove(
                "urgency-Critical", "urgency-High", "urgency-Normal", "urgency-Low"
            );
        }

    } catch (error) {
        console.error(error);
        alert("Failed to connect to server");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    }
});
