const BASE_URL = "https://artc-backend.onrender.com";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Login failed");
      return;
    }

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("role", data.role);

    if (data.role === "admin") {
      window.location.href = "../admin/dashboard.html";
    } else {
      window.location.href = "../user/dashboard.html";
    }

  } catch {
    alert("Server error");
  }
});
