import API from "./config.js";

const historyContainer = document.getElementById("historyContainer");
const sortSelect = document.getElementById("sortSelect");

async function loadAdminReports(sort = "latest") {
  const res = await fetch(`${API}/reports`);
  let reports = await res.json();

  reports.sort((a, b) =>
    sort === "latest"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at)
  );

  historyContainer.innerHTML = "";

  reports.forEach(r => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.innerHTML = `
      <h3>${r.title}</h3>
      <p>${r.description}</p>
      <span class="status">${r.status}</span>
    `;
    card.onclick = () => {
      window.location.href = `admin_report.html?id=${r.id}`;
    };
    historyContainer.appendChild(card);
  });
}

sortSelect.addEventListener("change", e => loadAdminReports(e.target.value));
loadAdminReports();
