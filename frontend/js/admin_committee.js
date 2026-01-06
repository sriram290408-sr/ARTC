const API = "https://artc-backend.onrender.com";
const container = document.getElementById("committeeContainer");

async function loadCommittee() {
  const res = await fetch(`${API}/committee`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  const members = await res.json();
  container.innerHTML = "";

  members.forEach(m => {
    container.innerHTML += `
      <div class="committee-card">
        <h3>${m.name}</h3>
        <p>${m.designation}</p>
        <button onclick="deleteMember(${m.id})">Delete</button>
      </div>
    `;
  });
}

async function addMember(name, designation) {
  await fetch(`${API}/committee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify({ name, designation })
  });
  loadCommittee();
}

async function deleteMember(id) {
  await fetch(`${API}/committee/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  });
  loadCommittee();
}

loadCommittee();
