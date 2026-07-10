document
.getElementById("loginForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const messageEl = document.getElementById("message");

    if(
        (username === "admin" && password === "admin123") ||
        (username === "staff" && password === "staff123")
    ){
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("role", username);

        window.location.href = "dashboard.html";
    }
    else{
        messageEl.innerText =
            "Invalid username or password";

        // Cosmetic-only feedback, no functional change.
        messageEl.classList.remove("shake");
        // Force reflow so the animation can replay on repeated errors.
        void messageEl.offsetWidth;
        messageEl.classList.add("shake");
    }
});

// Cosmetic only: show/hide the password field.
const passwordToggle = document.getElementById("passwordToggle");
const passwordInput = document.getElementById("password");

if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", function () {
        const showing = passwordInput.type === "text";
        passwordInput.type = showing ? "password" : "text";
        passwordToggle.setAttribute(
            "aria-label",
            showing ? "Show password" : "Hide password"
        );
    });
}
