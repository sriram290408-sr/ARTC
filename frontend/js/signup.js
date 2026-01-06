const BASE_URL = "https://artc-backend.onrender.com";

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const full_name = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password, role })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Signup failed");
      return;
    }

    alert("Signup successful");
    window.location.href = "login.html";

  } catch {
    alert("Server error");
  }
});
