const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const userprofile = document.getElementById("userprofile");

function checkForLeadingZeroString(number) {
  return number < 10 ? `0${number}` : number;
}

function createJoinDateString(date) {
  if (!date) throw Error("No date given.");

  const event = new Date(date);
  const options = { year: "numeric", month: "short", day: "numeric" };

  return `Joined ${event.toLocaleDateString("en-US", options)}`.replace(
    ",",
    ""
  );
}

function disableSearch(button, input) {
  button.classList.add("btn--disabled");
  input.setAttribute("disabled", "");
}
function enableSearch(button, input) {
  button.classList.remove("btn--disabled");
  input.removeAttribute("disabled", "");
}

function inputIsValid(input) {
  return !input.value ? false : true;
}

function displayError(message) {
  const searchError = document.getElementById("search-error");
  searchError.classList.remove("hidden");
  searchError.innerHTML = message;
}

async function getGithubUser(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  var user = await response.json();

  if (user.message && user.message.match(/not/gi)) return null;

  return user;
}

function clearError() {
  const searchError = document.getElementById("search-error");
  searchError.classList.add("hidden");
  searchError.innerHTML = "";
}

function setAvaibility(element, set) {
  if (!set) {
    element.classList.add("notavailable");
  } else {
    element.classList.remove("notavailable");
  }
}

function createCompanyUrl(company) {
  let gitName = company;

  if (!gitName) return gitName;

  if (gitName[0] === "@") gitName = gitName.replace("@", "");

  return "https://www.github.com/" + gitName.split(" ").join("+");
}

function drawUserprofile(user) {
  const domUser = {
    picture: document.getElementById("user-picture"),
    name: document.getElementById("user-name"),
    login: document.getElementById("user-login"),
    joined: document.getElementById("user-joindate"),
    bio: document.getElementById("user-bio"),
    stats: {
      repos: document.getElementById("user-stats--repos"),
      followers: document.getElementById("user-stats--followers"),
      following: document.getElementById("user-stats--following"),
    },
    location: document.getElementById("user-location--link"),
    blog: document.getElementById("user-blog--link"),
    twitter: document.getElementById("user-twitter--link"),
    company: document.getElementById("user-company--link"),
  };

  domUser.picture.src = user.avatar_url;
  domUser.name.innerHTML = user.name || user.login;
  domUser.login.innerHTML = `@${user.login}`;
  domUser.joined.innerHTML = createJoinDateString(user.created_at);
  domUser.bio.innerHTML = user.bio || "This profile has no bio";
  setAvaibility(domUser.bio, user.bio);

  domUser.stats.repos.innerHTML = user.public_repos;
  domUser.stats.followers.innerHTML = user.followers;
  domUser.stats.following.innerHTML = user.following;

  domUser.location.innerHTML = user.location || "Not available";
  domUser.blog.innerHTML =
    user.blog.replace("https://", "").replace("http://", "") || "Not available";
  domUser.twitter.innerHTML = user.twitter_username || "Not available";
  domUser.company.innerHTML = user.company || "Not available";

  const links = {
    location: {
      pElement: document.getElementById("user-location"),
      aElement: document.getElementById("user-location--link"),
      value: user.location,
    },
    blog: {
      pElement: document.getElementById("user-blog"),
      aElement: document.getElementById("user-blog--link"),
      value: user.blog,
    },
    twitter: {
      pElement: document.getElementById("user-twitter"),
      aElement: document.getElementById("user-twitter--link"),
      value: user.twitter_username,
    },
    company: {
      pElement: document.getElementById("user-company"),
      aElement: document.getElementById("user-company--link"),
      value: user.company,
    },
  };

  for (const link in links) {
    setAvaibility(links[link].pElement, links[link].value);
    if (link === "company") {
      setHrefAttribute(
        links[link].aElement,
        createCompanyUrl(links[link].value)
      );
    } else {
      setHrefAttribute(links[link].aElement, links[link].value);
    }
  }
}

function setVisibility(element, visible) {
  if (!visible) {
    element.classList.add("hidden");
  } else {
    element.classList.remove("hidden");
  }
}

function setHrefAttribute(element, url) {
  element.setAttribute("href", url ? url : "#");
}

getGithubUser("octocat").then((octocat) => {
  if (!octocat) {
    displayError("No results");
  } else {
    setVisibility(userprofile, true);
    drawUserprofile(octocat);
  }
});

searchBtn.addEventListener("click", async function () {
  clearError();
  disableSearch(searchBtn, searchInput);

  if (!inputIsValid(searchInput)) {
    setVisibility(userprofile, false);
    displayError("No results");
  } else {
    const user = await getGithubUser(searchInput.value);
    if (!user) {
      displayError("No results");
    } else {
      setVisibility(userprofile, true);
      drawUserprofile(user);
    }
  }

  enableSearch(searchBtn, searchInput);
});
