import API from "./config.js";

const container = document.getElementById("cardContainer");
const modal = document.getElementById("memberModal");
const form = document.getElementById("memberForm");
const addBtn = document.querySelector(".floating-add");
const closeBtn = document.getElementById("closeModal");

const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const emailInput = document.getElementById("email");
const linkedinInput = document.getElementById("linkedin");

const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

document.addEventListener("DOMContentLoaded", () => {
  ensureAdmin();
  loadMembers();
  addBtn.addEventListener("click", openForm);
  closeBtn.addEventListener("click", closeForm);
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

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeForm();
  }
});

async function loadMembers() {
  container.innerHTML = "";

  try {
    const res = await fetch(`${API}/committee`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch members");
    }

    const data = await res.json();
    console.log("Committee Data:", data);

    const members = Array.isArray(data) ? data : data.data;

    if (!members || members.length === 0) {
      container.innerHTML = "<p>No committee members found</p>";
      return;
    }

    members.forEach(addCard);

  } catch (err) {
    console.error(err);
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

  try {
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

  } catch (err) {
    console.error(err);
    alert("Error adding member");
  }
});

function addCard(member) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="../assets/profile.png" alt="Profile">
    <h3>${member.name}</h3>
    <p class="role">${member.designation || ""}</p>
    ${member.email ? `<p>${member.email}</p>` : ""}
    ${member.linkedin ? `<a href="${member.linkedin}" target="_blank">LinkedIn</a>` : ""}
    <div class="card-actions">
      <button class="delete-btn">Delete</button>
    </div>
  `;

  const deleteBtn = card.querySelector(".delete-btn");

  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete member?")) return;

    try {
      const res = await fetch(`${API}/committee/${member.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        card.remove();
      } else {
        alert("Delete failed");
      }

    } catch (err) {
      console.error(err);
      alert("Error deleting member");
    }
  });

  container.appendChild(card);
}
