const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

const disableSearch = function (button, input) {
  button.classList.add("btn--disabled");
  input.setAttribute("disabled", "");
};
const enableSearch = function (button, input) {
  button.classList.remove("btn--disabled");
  input.removeAttribute("disabled", "");
};

const inputIsValid = function (input) {
  return !input.value ? false : true;
};

const displayError = function (message) {
  const searchError = document.getElementById("search-error");
  searchError.classList.remove("hidden");
  searchError.innerHTML = message;
};

async function getGithubUser(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  var user = await response.json();

  if (user.message && user.message.match(/not/gi)) return null;

  return user;
}

const clearError = function () {
  const searchError = document.getElementById("search-error");
  searchError.classList.add("hidden");
  searchError.innerHTML = "";
};

searchBtn.addEventListener("click", async function () {
  clearError();
  disableSearch(searchBtn, searchInput);

  if (!inputIsValid(searchInput)) {
    displayError("No username given");
  } else {
    const user = await getGithubUser(searchInput.value);
    if (user === null) displayError("No results");
    console.log(user);
  }

  enableSearch(searchBtn, searchInput);
});
