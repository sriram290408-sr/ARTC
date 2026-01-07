const API = "https://artc-backend.onrender.com";

const container = document.getElementById("cardContainer");
const modal = document.getElementById("memberModal");
const form = document.getElementById("memberForm");
const addBtn = document.querySelector(".floating-add");

const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const emailInput = document.getElementById("email");
const linkedinInput = document.getElementById("linkedin");

const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

let selectedCard = null;

document.addEventListener("DOMContentLoaded", () => {
  ensureAdmin();
  loadMembers();
});

function ensureAdmin() {
  if (!token || role !== "faculty") {
    alert("Admin access only");
    window.location.href = "../html/login.html";
  }
}

function openForm() {
  modal.style.display = "flex";
}

function closeForm() {
  modal.style.display = "none";
  form.reset();
}

window.onclick = (e) => {
  if (e.target === modal) closeForm();
};

async function loadMembers() {
  container.innerHTML = "";

  try {
    const res = await fetch(`${API}/committee`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const members = await res.json();
    members.forEach(addCard);

  } catch {
    container.innerHTML = "<p>Failed to load committee</p>";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: nameInput.value.trim(),
    designation: roleInput.value.trim(),
    email: emailInput.value.trim(),
    linkedin: linkedinInput.value.trim()
  };

  const res = await fetch(`${API}/committee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    alert("Only admin can add members");
    return;
  }

  closeForm();
  loadMembers();
});

function addCard(member) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="../assets/profile.png">
    <h3>${member.name}</h3>
    <p class="role">${member.designation || ""}</p>
    ${member.email ? `<p>${member.email}</p>` : ""}
    ${member.linkedin ? `<a href="${member.linkedin}" target="_blank">LinkedIn</a>` : ""}
    <button class="delete-btn">Delete</button>
  `;

  const deleteBtn = card.querySelector(".delete-btn");

  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete member?")) return;

    await fetch(`${API}/committee/${member.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    card.remove();
  });

  container.appendChild(card);
}
