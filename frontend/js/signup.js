document.querySelector(".signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const role = document.getElementById("role").value;

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const res = await fetch("https://artc-backend.onrender.com/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: fullname,
      email: email,
      password: password,
      role: role
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.detail || "Signup failed");
    return;
  }

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("role", data.role);

  if (data.role === "student") {
    window.location.href = "/frontend/html/home.html";
  } else if (data.role === "faculty") {
    window.location.href = "/frontend/html/admin.html";
  }
});
