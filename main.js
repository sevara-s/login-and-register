const api = "https://676e39ccdf5d7dac1cca000c.mockapi.io/user";  

async function fetchUsers() {
  const response = await fetch(api);
  if (!response.ok) {
    throw new Error("Error");
  }
  return response.json();
}

async function registerUser(name, email, password) {
  const response = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      photo: `https://i.pravatar.cc/150?u=${email}`,  
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return response.json();
}

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const newUser = await registerUser(name, email, password);
      alert("You can now log in.");
      window.location.href = "index.html";  
    } catch (error) {
      console.error("Error registering", error);
      alert("Error");
    }
  });
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const users = await fetchUsers();

      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "profile.html";
      } else {
        alert("Error");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error");
    }
  });
}

const profileName = document.getElementById("profile-name");
const profilePhoto = document.getElementById("profile-photo");
const profileEmail = document.getElementById("profile-email");
if (profileName && profilePhoto && profileEmail) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    profileName.textContent = loggedInUser.name;
    profilePhoto.src = loggedInUser.photo;
    profileEmail.textContent = loggedInUser.email;
  } else {
    window.location.href = "index.html";
  }
}

const logoutButton = document.getElementById("logout");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    const confirmation = confirm("Do you want to log out?");
    if (confirmation) {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    }
  });
}
