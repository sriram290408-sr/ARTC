const BASE_URL = "https://artc-backend.onrender.com";

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const full_name = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!full_name || !email || !password || !role) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password, role })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Signup failed");
      return;
    }

    alert("Signup successful! Redirecting to login page...");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("Server error. Please try again later.");
  }
});
