document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const full_name = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!full_name || !email || !password || !role) {
    alert("All fields are required");
    return;
  }

  try {
    const res = await fetch("https://artc-backend.onrender.com/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        full_name,
        email,
        password,
        role
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Signup failed");
      return;
    }

    alert("Signup successful. Please login.");
    window.location.href = "./login.html";

  } catch (error) {
    console.error(error);
    alert("Server error. Try again later.");
  }
});
