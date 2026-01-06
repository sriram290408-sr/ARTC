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
      </div>
    `;
  });
}

loadCommittee();
