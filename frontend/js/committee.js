const container = document.getElementById("committeeContainer");

document.addEventListener("DOMContentLoaded", () => {
  const members =
    JSON.parse(localStorage.getItem("committeeMembers")) || [];

  if (members.length === 0) {
    container.innerHTML =
      "<p>No committee members added yet.</p>";
    return;
  }

  members.forEach(member => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="../assets/profile.png" alt="${member.name}">
      <h3>${member.name}</h3>
      <p class="role">${member.role}</p>
      <p>${member.desc}</p>
    `;

    container.appendChild(card);
  });
});
