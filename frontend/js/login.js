const API = "http://127.0.0.1:8000";

document.getElementById("loginForm").onsubmit = async (e) => {
  e.preventDefault();

  const res = await fetch(`${API}/users/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();

  localStorage.setItem("token", data.access_token);

  if (data.user.role === "admin") {
    location.href = "admin.html";
  } else {
    location.href = "student.html";
  }
};