const container = document.getElementById("cardContainer");
const modal = document.getElementById("memberModal");
const form = document.getElementById("memberForm");
const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const descInput = document.getElementById("desc");
const linkedinInput = document.getElementById("linkedin");

let selectedCard = null;

document.addEventListener("DOMContentLoaded", loadMembers);

function openForm() { modal.style.display = "flex"; }
function closeForm() { modal.style.display = "none"; }
window.onclick = (e) => { if(e.target===modal) closeForm(); }

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const member = {
    name: nameInput.value.trim(),
    role: roleInput.value.trim(),
    desc: descInput.value.trim(),
    linkedin: linkedinInput.value.trim(),
    img: "../assets/profile.png"
  };
  const members = JSON.parse(localStorage.getItem("committeeMembers")) || [];
  members.push(member);
  localStorage.setItem("committeeMembers", JSON.stringify(members));
  addCard(member);
  form.reset();
  closeForm();
});

function loadMembers() {
  const members = JSON.parse(localStorage.getItem("committeeMembers")) || [];
  members.forEach(addCard);
}

function addCard(member) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${member.img}" alt="${member.name}">
    <h3>${member.name}</h3>
    <p class="role">${member.role}</p>
    <p>${member.desc}</p>
    ${member.linkedin ? `<a href="${member.linkedin}" class="linkedin" target="_blank">LinkedIn</a>` : ""}
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

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if(confirm(`Are you sure you want to delete ${member.name}?`)) {
      const members = JSON.parse(localStorage.getItem("committeeMembers")) || [];
      const index = members.findIndex(m => m.name === member.name && m.role === member.role);
      if(index > -1) members.splice(index,1);
      localStorage.setItem("committeeMembers", JSON.stringify(members));
      card.remove();
    }
  });

  container.appendChild(card);
}
