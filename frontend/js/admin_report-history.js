const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("access_token");

const container = document.getElementById("historyContainer");

async function loadReports() {
  try {
    const res = await fetch(`${API}/reports/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const reports = await res.json();
    container.innerHTML = "";

    reports.forEach(r => {
      container.innerHTML += `
        <div class="report-card" onclick="openReport(${r.id})">
          <h3>${r.title}</h3>
          <p>${r.description}</p>
          <span>Status: ${r.status}</span>
        </div>
      `;
    });
  } catch {
    alert("Failed to load reports");
  }
}

function openReport(id) {
  window.location.href = `admin_report.html?id=${id}`;
}

loadReports();
