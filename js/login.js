document
.getElementById("loginForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if(
        (username === "admin" && password === "admin123") ||
        (username === "staff" && password === "staff123")
    ){
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("role", username);

        window.location.href = "dashboard.html";
    }
    else{
        document.getElementById("message").innerText =
            "Invalid username or password";
    }
});