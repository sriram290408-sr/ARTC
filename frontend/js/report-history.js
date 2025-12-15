const API_BASE_URL = "http://127.0.0.1:8000";
const container = document.getElementById("historyContainer");
const sortSelect = document.getElementById("sortSelect");

let reports = [];

document.addEventListener("DOMContentLoaded", loadHistory);
sortSelect.addEventListener("change", renderReports);

async function loadHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/reports/history`);
    if (!res.ok) throw new Error("Failed to fetch reports");
    reports = await res.json();
    renderReports();
  } catch (err) {
    console.error(err);
    container.innerHTML += "<p>Failed to load reports</p>";
  }
}

function renderReports() {
  document.querySelectorAll(".report-card").forEach(e => e.remove());
  let sorted = [...reports];
  if (sortSelect.value === "oldest") sorted.reverse();
  sorted.forEach(r => {
    const card = document.createElement("div");
    card.className = `report-card status-${r.status.toLowerCase()}`;
    card.innerHTML = `
      <div class="report-left">
        <div class="report-title">${r.title}</div>
        <div class="report-desc">${r.description}</div>
        <div class="report-extra">
          <strong>Location:</strong> ${r.incident_location}<br>
          <strong>Reported by:</strong> ${r.name} (${r.class_section})<br>
          ${r.people_involved ? `<strong>People involved:</strong> ${r.people_involved}<br>` : ""}
        </div>
      </div>
      <div class="report-right">
        <div class="report-type">${r.problem_type}</div>
        <div class="report-date">${formatDate(r.incident_date)}</div>
        <div class="status-label ${r.status.toLowerCase()}">${r.status}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
