const container = document.getElementById("cardContainer");
const modal = document.getElementById("memberModal");
const form = document.getElementById("memberForm");

document.addEventListener("DOMContentLoaded", loadMembers);

function openForm() {
  modal.style.display = "flex";
}

function closeForm() {
  modal.style.display = "none";
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const members = JSON.parse(localStorage.getItem("committeeMembers")) || [];

  const member = {
    id: Date.now(),
    name: document.getElementById("name").value,
    role: document.getElementById("role").value,
    desc: document.getElementById("desc").value,
    linkedin: document.getElementById("linkedin").value,
    img: "../assets/profile.png"
  };

  members.push(member);
  localStorage.setItem("committeeMembers", JSON.stringify(members));

  loadMembers();
  form.reset();
  closeForm();
});

function loadMembers() {
  const members = JSON.parse(localStorage.getItem("committeeMembers")) || [];
  container.innerHTML = "";

  members.forEach(member => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${member.img}">
      <h3>${member.name}</h3>
      <p class="role">${member.role}</p>
      <p>${member.desc}</p>

      <a href="${member.linkedin}" target="_blank" class="linkedin">
        LinkedIn
      </a>

      <button class="delete-btn" onclick="deleteMember(${member.id})">
        Delete
      </button>
    `;

    container.appendChild(card);
  });
}

function deleteMember(id) {
  let members = JSON.parse(localStorage.getItem("committeeMembers")) || [];
  members = members.filter(m => m.id !== id);
  localStorage.setItem("committeeMembers", JSON.stringify(members));
  loadMembers();
}
