const API = "https://artc-backend.onrender.com";
const container = document.getElementById("cardContainer");
const modal = document.getElementById("memberModal");
const form = document.getElementById("memberForm");
const addBtn = document.querySelector(".floating-add");

const role = localStorage.getItem("role");

addBtn.style.display = role === "faculty" ? "block" : "none";

function openForm() {
  modal.style.display = "block";
}

function closeForm() {
  modal.style.display = "none";
  form.reset();
}

window.onclick = (e) => {
  if (e.target === modal) closeForm();
};

function getToken() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("You are not logged in!");
    window.location.href = "./login.html";
    return null;
  }
  return token;
}

async function loadCommittee() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API}/committee`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401) {
      alert("Unauthorized! Please login again.");
      localStorage.removeItem("access_token");
      window.location.href = "./login.html";
      return;
    }

    if (!res.ok) throw new Error("Failed to fetch members");

    const members = await res.json();
    container.innerHTML = "";

    members.forEach(m => {
      container.innerHTML += `
        <div class="card">
          <img src="../assets/profile.png" alt="${m.name}">
          <h3>${m.name}</h3>
          <div class="role">${m.designation || ""}</div>
          ${m.email ? `<p>Email: ${m.email}</p>` : ""}
          ${m.phone ? `<p>Phone: ${m.phone}</p>` : ""}
          ${m.linkedin ? `<p>LinkedIn: <a href="${m.linkedin}" target="_blank">${m.linkedin}</a></p>` : ""}
          ${m.description ? `<p>${m.description}</p>` : ""}
          ${
            role === "faculty"
              ? `<div class="card-actions"><button class="delete-btn" onclick="deleteMember(${m.id})">Delete</button></div>`
              : ""
          }
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load committee members.</p>";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = getToken();
  if (!token) return;

  const data = {
    name: form.name.value,
    designation: form.role.value || null,
    email: form.email?.value || null,
    phone: form.phone?.value || null,
    linkedin: form.linkedin?.value || null,
    description: form.desc?.value || null
  };

  try {
    const res = await fetch(`${API}/committee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (res.status === 401) {
      alert("Unauthorized! Only faculty can add members.");
      return;
    }

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Failed to add member");
      return;
    }

    closeForm(); 
    loadCommittee(); 
  } catch (err) {
    console.error(err);
    alert("Failed to add member");
  }
});

async function deleteMember(id) {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API}/committee/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401) {
      alert("Unauthorized! Only faculty can delete members.");
      return;
    }

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Failed to delete member");
      return;
    }

    loadCommittee();
  } catch (err) {
    console.error(err);
    alert("Failed to delete member");
  }
}

loadCommittee();
