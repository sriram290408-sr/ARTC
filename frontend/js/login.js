document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

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

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.role);

    if (data.role === "admin" || data.role === "faculty") {
      window.location.href = "/frontend/html/admin.html";
    } else {
      window.location.href = "/frontend/html/home.html";
    }

  } catch (err) {
    alert("Server error. Try again later.");
    console.error(err);
  }
});
