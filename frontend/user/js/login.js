document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://YOUR_RENDER_URL/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.detail);
    return;
  }

  localStorage.setItem("token", data.access_token);
  localStorage.setItem("role", data.role);

  if (data.role === "admin" || data.role === "faculty") {
    window.location.href = "/frontend/admin/html/admin.html";
  } else {
    window.location.href = "/frontend/user/html/home.html";
  }
});
