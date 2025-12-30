document.querySelector(".signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    full_name: fullname.value,
    email: email.value,
    role: role.value,
    password: password.value
  };

  const res = await fetch("https://YOUR_RENDER_URL/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  const data = await res.json();

  if (data.role === "student") {
    window.location.href = "/frontend/user/html/home.html";
  } else {
    window.location.href = "/frontend/admin/html/admin.html";
  }
});
