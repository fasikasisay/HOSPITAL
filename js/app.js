let tokenCounter = 1;

document.getElementById("patientForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    const token =
        String(tokenCounter).padStart(3,"0");

    const queuePosition = tokenCounter;

    const waitingTime = queuePosition * 5;

    document.getElementById("result").innerHTML = `
        <h3>Registration Successful</h3>
        <p><strong>Token Number:</strong> ${token}</p>
        <p><strong>Queue Position:</strong> ${queuePosition}</p>
        <p><strong>Estimated Waiting Time:</strong> ${waitingTime} minutes</p>
    `;

    document.getElementById("result")
        .classList.remove("hidden");

    tokenCounter++;

    this.reset();
});