const API_BASE = "http://localhost:5000";

const loginForm = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

function showError(text) {
    messageEl.innerText = text;
    messageEl.classList.remove("shake");
    // Force reflow so the animation can replay on repeated errors.
    void messageEl.offsetWidth;
    messageEl.classList.add("shake");
}
 
loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const submitBtn = loginForm.querySelector("button[type='submit']");
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : null;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Signing in…";
    }
    messageEl.innerText = "";

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.message || "Invalid username or password");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("role", data.user.role);

        window.location.href = "dashboard.html";
    } catch (error) {
        console.error(error);
        showError("Could not reach the server. Please try again.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
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
