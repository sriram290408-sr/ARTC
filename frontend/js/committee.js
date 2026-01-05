const container = document.getElementById("committeeContainer");

document.addEventListener("DOMContentLoaded", () => {
  const members = JSON.parse(localStorage.getItem("committeeMembers")) || [];

  if (members.length === 0) {
    container.innerHTML = "<p>No committee members added yet.</p>";
    return;
  }

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
    `;

    container.appendChild(card);
  });
});
