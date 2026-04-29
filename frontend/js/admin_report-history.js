import API from "./config.js";

const historyContainer = document.getElementById("historyContainer");
const sortSelect = document.getElementById("sortSelect");

async function loadAdminReports(sort = "latest") {
  const res = await fetch(`${API}/reports`);
  let reports = await res.json();

  reports.sort((a, b) =>
    sort === "latest"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at),
  );

  historyContainer.innerHTML = "";

  if (reports.length === 0) {
    historyContainer.innerHTML = "<p>No reports found</p>";
    return;
  }

  reports.forEach((r) => {
    const card = document.createElement("div");
    card.className = "history-card";

    card.innerHTML = `
      <h3>${r.title}</h3>
      <p>${r.description}</p>
      <span class="status status-${r.status}">${r.status}</span>
      <button class="rev-btn">Review</button>
    `;

    const button = card.querySelector(".rev-btn");

    button.onclick = () => {
      window.location.href = `admin_report.html?id=${r.id}`;
    };

    historyContainer.appendChild(card);
  });
}

sortSelect.addEventListener("change", (e) => {
  loadAdminReports(e.target.value);
});

loadAdminReports();
