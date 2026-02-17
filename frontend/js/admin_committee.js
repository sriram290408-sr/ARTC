import API from "./config.js";

const container = document.getElementById("cardContainer");
const modal = document.getElementById("memberModal");
const form = document.getElementById("memberForm");

const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const emailInput = document.getElementById("email");
const linkedinInput = document.getElementById("linkedin");

const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

/* -------------------- PAGE LOAD -------------------- */

document.addEventListener("DOMContentLoaded", () => {
  if (!token || role !== "faculty") {
    alert("Admin access only");
    window.location.href = "../html/login.html";
    return;
  }

  loadMembers();
});

/* -------------------- LOAD MEMBERS -------------------- */

async function loadMembers() {
  container.innerHTML = "";

  try {
    const res = await fetch(`${API}/committee`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      container.innerHTML = "<p>Failed to load members</p>";
      return;
    }

    const members = await res.json();

    members.forEach(member => {
      const card = createCard(member);
      container.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = "<p>Something went wrong</p>";
  }
}

/* -------------------- ADD MEMBER -------------------- */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const designation = roleInput.value.trim();
  const email = emailInput.value.trim();
  const linkedin = linkedinInput.value.trim();

  if (!name || !designation) {
    alert("Name and designation are required");
    return;
  }

  const res = await fetch(`${API}/committee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, designation, email, linkedin })
  });

  if (!res.ok) {
    alert("Failed to add member");
    return;
  }

  form.reset();
  modal.style.display = "none";
  loadMembers();
});

/* -------------------- CREATE CARD -------------------- */

function createCard(member) {
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

    const res = await fetch(`${API}/committee/${member.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      alert("Failed to delete member");
      return;
    }

    card.remove();
  });

  return card;
}
