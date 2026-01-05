const API = "https://artc-backend.onrender.com";

const container = document.getElementById("historyContainer");
const sortSelect = document.getElementById("sortSelect");

let reports = [];

async function loadReports() {
  try {
    const res = await fetch(`${API}/reports`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch reports");

    reports = await res.json();
    showReports();
  } catch (err) {
    container.innerHTML = `<p class="error">Error loading reports: ${err.message}</p>`;
  }
}

function showReports() {
  container.innerHTML = "";

  let list = [...reports];
  if (sortSelect.value === "oldest") list.reverse();

  list.forEach(r => {
    container.innerHTML += `
      <div class="report-card status-${r.status}" onclick="openReport(${r.id})">
        <div>
          <h3>${r.title}</h3>
          <p>${truncate(r.description, 100)}</p>
          <small>
            <b>Location:</b> ${r.incident_location}<br>
            <b>Reported By:</b> ${r.name} (${r.class_section})
          </small>
        </div>
        <div>
          <b>${r.problem_type}</b><br>
          ${formatDate(r.incident_date)}<br>
          <span class="status ${r.status}">${r.status}</span>
        </div>
      </div>
    `;
  });
}

function openReport(id) {
  window.location.href = `admin_report.html?id=${id}`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN");
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

sortSelect.addEventListener("change", showReports);

loadReports();
