document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!emailInput || !passwordInput) {
    alert("Login fields not found");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("https://artc-backend.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Login failed");
      return;
    }

    // Store auth data
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("role", data.role);

    // Role-based redirect
    if (data.role === "admin" || data.role === "faculty") {
      window.location.href = "./admin.html";
    } else {
      window.location.href = "./home.html";
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});
