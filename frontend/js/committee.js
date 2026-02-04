import API from "./config";

const container = document.getElementById("committeeContainer");

document.addEventListener("DOMContentLoaded", loadCommittee);

async function loadCommittee() {
  container.innerHTML = "";

  try {
    const res = await fetch(`${API}/committee`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch committee");

    const members = await res.json();

    if (members.length === 0) {
      container.innerHTML = "<p>No committee members added yet.</p>";
      return;
    }

    members.forEach(member => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="../assets/profile.png" alt="${member.name}">
        <h3>${member.name}</h3>
        <p class="role">${member.designation || ""}</p>
        <p>${member.description || ""}</p>
        ${
          member.linkedin
            ? `<a href="${member.linkedin}" target="_blank" class="linkedin">LinkedIn</a>`
            : ""
        }
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading committee members.</p>";
  }
}
