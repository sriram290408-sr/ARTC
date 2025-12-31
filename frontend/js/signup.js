document.querySelector(".signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const user = {
    full_name: fullname,
    email: email,
    password: password,
    role: role
  };

  try {
    const res = await fetch("https://YOUR_RENDER_URL/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Signup failed");
      return;
    }

    // Save login info
    localStorage.setItem("user_id", data.id);
    localStorage.setItem("role", data.role);

    // Redirect based on role
    if (data.role === "student") {
      window.location.href = "/frontend/user/html/home.html";
    } else {
      window.location.href = "/frontend/admin/html/admin.html";
    }

  } catch (error) {
    alert("Server error. Try again later.");
    console.error(error);
  }
});
