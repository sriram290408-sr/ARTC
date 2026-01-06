document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("https://artc-backend.onrender.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Login failed");
      return;
    }

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("role", data.role);

    if (data.role === "admin" || data.role === "faculty") {
      window.location.href = "./admin.html";
    } else {
      window.location.href = "./home.html";
    }

  } catch (error) {
    console.error(error);
    alert("Server error. Try again later.");
  }
});
