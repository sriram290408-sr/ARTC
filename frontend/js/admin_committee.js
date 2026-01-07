const API = "https://artc-backend.onrender.com";

const container = document.getElementById("cardContainer");
const modal = document.getElementById("memberModal");
const form = document.getElementById("memberForm");

const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const emailInput = document.getElementById("email");
const linkedinInput = document.getElementById("linkedin");

let selectedCard = null;

document.addEventListener("DOMContentLoaded", loadMembers);

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
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    });

    if (!res.ok) throw new Error("Failed to load");

    const members = await res.json();
    members.forEach(renderCard);

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load committee members</p>";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: nameInput.value.trim(),
    designation: roleInput.value.trim() || null,
    email: emailInput.value.trim() || null,
    linkedin: linkedinInput.value.trim() || null
  };

  try {
    const res = await fetch(`${API}/committee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      alert("Only faculty can add members");
      return;
    }

    closeForm();
    loadMembers();

  } catch (err) {
    console.error(err);
    alert("Failed to add member");
  }
});

function renderCard(member) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="../assets/profile.png" alt="${member.name}">
    <h3>${member.name}</h3>
    <p class="role">${member.designation || ""}</p>
    ${member.email ? `<p>Email: ${member.email}</p>` : ""}
    ${member.linkedin ? `<a href="${member.linkedin}" target="_blank">LinkedIn</a>` : ""}
    <div class="card-actions">
      <button class="delete-btn" style="display:none;">Delete</button>
    </div>
  `;

  const deleteBtn = card.querySelector(".delete-btn");

  card.addEventListener("click", () => {
    if (selectedCard && selectedCard !== card) {
      selectedCard.querySelector(".delete-btn").style.display = "none";
    }
    selectedCard = card;
    deleteBtn.style.display = "inline-flex";
  });

  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();

    if (!confirm(`Delete ${member.name}?`)) return;

    try {
      const res = await fetch(`${API}/committee/${member.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      card.remove();

    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  });

  container.appendChild(card);
}
