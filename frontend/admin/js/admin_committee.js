const container = document.querySelector(".card-container");
const modal = document.getElementById("memberModal");
const form = document.getElementById("memberForm");
const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const descInput = document.getElementById("desc");

document.addEventListener("DOMContentLoaded", loadMembers);

function openForm() {
  modal.style.display = "flex";
}

function closeForm() {
  modal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(e) {
  if (e.target === modal) closeForm();
}

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const member = {
    name: nameInput.value.trim(),
    role: roleInput.value.trim(),
    desc: descInput.value.trim(),
    img: "../assets/profile.png" // default image
  };

  // Save to localStorage
  const members = JSON.parse(localStorage.getItem("committeeMembers")) || [];
  members.push(member);
  localStorage.setItem("committeeMembers", JSON.stringify(members));

  addCard(member);
  form.reset();
  closeForm();
});

// Load members from localStorage
function loadMembers() {
  const members = JSON.parse(localStorage.getItem("committeeMembers")) || [];
  members.forEach(addCard);
}

// Create a card
function addCard(member) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${member.img}" alt="Profile">
    <h3>${member.name}</h3>
    <p class="role">${member.role}</p>
    <p>${member.desc}</p>
  `;
  container.appendChild(card);
}
