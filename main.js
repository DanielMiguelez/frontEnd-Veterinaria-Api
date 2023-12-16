const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const btn = document.getElementById("btn");

let token = localStorage.token || "";

async function login(e) {
  e.preventDefault();
  try {
    const user = {
      username: usernameInput.value,
      password: passwordInput.value,
    };
    const response = await fetch(`http://localhost:3000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    token = data.token;
    localStorage.token = token;
    logged();
  } catch (error) {
    console.error(error);
  }
}

btn.addEventListener("click", login);

// SPA
const usersDiv = document.querySelector(".users");
const loginDiv = document.querySelector(".login");
const loginNav = document.getElementById("loginNav");
const usersNav = document.getElementById("usersNav");
const logoutNav = document.getElementById("logoutNav");

function hideViews() {
  loginDiv.classList.add("hide");
  loginNav.classList.add("hide");
  usersDiv.classList.add("hide");
  usersNav.classList.add("hide");
  logoutNav.classList.add("hide");
}

function showNavLogged() {
  usersNav.classList.remove("hide");
  logoutNav.classList.remove("hide");
}

function printUsers(data) {
  usersDiv.innerHTML = "";
  if (data.message) {
    return (usersDiv.innerHTML = data.message);
  }
  data.clients.forEach((user) => {
    usersDiv.innerHTML += `
                <div>
                  <h5>${user.name}</h5>
                  <p>${user.mail}</p>
              </div>
                `;
  });
}

async function getUsers() {
  try {
    hideViews();
    showNavLogged();
    usersDiv.classList.remove("hide");
    const res = await fetch("http://localhost:3000/clients/all", {
      headers: {
        Authorization: token,
      },
    });
    const data = await res.json();
    printUsers(data);
  } catch (error) {
    console.error(error);
  }
}

function logged() {
  if (token.length > 0) {
    hideViews();
    showNavLogged();
    getUsers();
  } else {
    loginDiv.classList.remove("hide");
    loginNav.classList.remove("hide");
  }
}
logged();
function logout() {
  localStorage.clear();
  token = "";
  hideViews();
  logged();
}

logoutNav.addEventListener("click", logout);
usersNav.addEventListener("click", getUsers);
