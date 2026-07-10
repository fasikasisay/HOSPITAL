 
(function () {
    var STORAGE_KEY = "theme";
    var root = document.documentElement;

    function applyTheme(theme) {
        if (theme === "dark") {
            root.setAttribute("data-theme", "dark");
        } else {
            root.removeAttribute("data-theme");
        }
    }

    var saved = localStorage.getItem(STORAGE_KEY);
    var prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));

    function updateLabel() {
        var label = document.getElementById("themeToggleLabel");
        if (label) {
            label.textContent =
                root.getAttribute("data-theme") === "dark" ? "Light mode" : "Dark mode";
        }
    }

    function toggleTheme() {
        var isDark = root.getAttribute("data-theme") === "dark";
        var next = isDark ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
        updateLabel();
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("#themeToggle").forEach(function (btn) {
            btn.addEventListener("click", toggleTheme);
        });
        updateLabel();
    });
})();
