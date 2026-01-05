const API = "https://artc-backend.onrender.com";
const container = document.getElementById("historyContainer");
const sortSelect = document.getElementById("sortSelect");

let reports = [];

document.addEventListener("DOMContentLoaded", fetchReports);
sortSelect.addEventListener("change", showReports);

async function fetchReports() {
  try {
    const res = await fetch(API + "/reports/history");
    reports = await res.json();
    showReports();
  } catch {
    container.innerHTML = "<p>Unable to load reports</p>";
  }
}

function showReports() {
  container.innerHTML = "";
  let list = [...reports];
  if (sortSelect.value === "oldest") list.reverse();

  list.forEach(r => {
    container.innerHTML += `
      <div class="report-card status-${r.status.toLowerCase()}">
        <div>
          <h3>${r.title}</h3>
          <p>${r.description}</p>
          <small>
            Location: ${r.incident_location}<br>
            By: ${r.name} (${r.class_section})<br>
            ${r.people_involved ? `People: ${r.people_involved}` : ""}
          </small>
        </div>
        <div>
          <b>${r.problem_type}</b><br>
          ${formatDate(r.incident_date)}<br>
          <span class="status status-${r.status.toLowerCase()}">${r.status}</span>
        </div>
      </div>
    `;
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN");
}
