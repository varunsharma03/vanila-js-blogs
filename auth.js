const isLogin = { current: true }; // Track current mode
const formTitle = document.getElementById("form-title");
const authForm = document.getElementById("auth-form");
const emailField = document.getElementById("email-field");
const passwordField = document.getElementById("password-field");
const nameField = document.getElementById("name-field");
const submitBtn = document.getElementById("auth-submit-btn");
const switchForm = document.getElementById("switch-form");
const authMessage = document.getElementById("auth-message");

const API_BASE = "http://localhost:3000"; // your backend base

switchForm.addEventListener("click", () => {
  isLogin.current = !isLogin.current;

  if (isLogin.current) {
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    nameField.style.display = "none";
    switchForm.textContent = "Register here";
  } else {
    formTitle.textContent = "Register";
    submitBtn.textContent = "Register";
    nameField.style.display = "block";
    switchForm.textContent = "Login here";
  }
  authMessage.textContent = "";
});

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMessage.textContent = "";

  const email = emailField.value.trim();
  const password = passwordField.value.trim();
  const name = nameField.value.trim();

  if (!email || !password || (!isLogin.current && !name)) {
    authMessage.textContent = "Please fill in all fields.";
    return;
  }

  const endpoint = isLogin.current ? "/login" : "/register";

  const payload = isLogin.current
    ? { email, password }
    : { email, password, name };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!result.status) {
      throw new Error(result.message);
    }

    if (isLogin.current) {
      localStorage.setItem("userId", result.data.uuid);
      localStorage.setItem("userName", result.data.name);
      window.location.href = "index.html";
    } else {
      alert("Registration successful. You can now log in.");
      switchForm.click(); // Switch to login mode
    }
  } catch (err) {
    authMessage.textContent = err.message;
  }
});
