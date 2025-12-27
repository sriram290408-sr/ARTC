const API = "http://127.0.0.1:8000";

document.getElementById("signupForm").onsubmit = async (e) => {
  e.preventDefault();

  const res = await fetch(`${API}/users/create`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      full_name: name.value,
      email: email.value,
      role: role.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (data.role === "admin") {
    location.href = "admin.html";
  } else {
    location.href = "student.html";
  }
};