const API = "https://artc-backend.onrender.com";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Login failed");
      return;
    }

    // ✅ Store token correctly
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);

    // ✅ Role-based redirect
    if (data.role === "admin" || data.role === "faculty") {
      window.location.href = "../html/admin.html";
    } else {
      window.location.href = "../html/home.html";
    }
  } catch (err) {
    console.error(err);
    alert("Server error. Please try again later.");
  }
});
