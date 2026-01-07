const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("access_token");

const container = document.getElementById("historyContainer");
const sortSelect = document.getElementById("sortSelect");

let reports = [];

async function loadReports() {
  try {
    const res = await fetch(`${API}/reports/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error();

    reports = await res.json();
    renderReports();
  } catch {
    alert("Failed to load reports");
  }
}

function renderReports() {
  container.innerHTML = "";

  const sorted = [...reports].sort((a, b) => {
    return sortSelect.value === "latest"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at);
  });

  sorted.forEach(r => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.innerHTML = `
      <h3>${r.title}</h3>
      <p>${r.content}</p>
      <small>Status: ${r.status || "Pending"}</small>
    `;
    container.appendChild(card);
  });
}

sortSelect.addEventListener("change", renderReports);

loadReports();
