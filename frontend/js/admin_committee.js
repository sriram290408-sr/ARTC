const API = "https://artc-backend.onrender.com";
const container = document.getElementById("cardContainer");
const modal = document.getElementById("memberModal");
const form = document.getElementById("memberForm");
const addBtn = document.querySelector(".floating-add");

const role = localStorage.getItem("role"); // Only faculty can add/delete

addBtn.style.display = role === "faculty" ? "block" : "none";

function openForm() {
  modal.style.display = "block";
}

function closeForm() {
  modal.style.display = "none";
  form.reset();
}

// Load committee members
async function loadCommittee() {
  const res = await fetch(`${API}/committee`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
  });
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
        ${role === "faculty" ? `<div class="card-actions"><button class="delete-btn" onclick="deleteMember(${m.id})">Delete</button></div>` : ""}
      </div>
    `;
  });
}

// Add member
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: form.name.value,
    designation: form.role.value,
    email: form.email?.value || null,
    phone: form.phone?.value || null,
    linkedin: form.linkedin?.value || null,
    description: form.desc?.value || null
  };

  const res = await fetch(`${API}/committee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    alert("Faculty only can add members");
    return;
  }

  closeForm();
  loadCommittee();
});

// Delete member
async function deleteMember(id) {
  await fetch(`${API}/committee/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
  });
  loadCommittee();
}

window.onclick = (e) => {
  if (e.target === modal) closeForm();
};

loadCommittee();
