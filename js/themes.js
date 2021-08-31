const themeBtn = document.getElementById("theme-btn-toggle");
const usersColorScheme = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

const invertColorScheme = function (currentColorScheme) {
  // If the OS is set to dark mode...
  if (currentColorScheme) {
    // Dark
    document.body.classList.toggle("light-theme");
  } else {
    // Light
    document.body.classList.toggle("dark-theme");
  }
};

themeBtn.addEventListener("click", function () {
  invertColorScheme(usersColorScheme);
});
