const API = "https://artc-backend.onrender.com";
const container = document.getElementById("historyContainer");

async function loadReports() {
  const res = await fetch(`${API}/reports/history`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const reports = await res.json();
  container.innerHTML = "";

  reports.forEach(r => {
    container.innerHTML += `
      <div class="report-card" onclick="openReport(${r.id})">
        <h3>${r.title}</h3>
        <span>${r.status}</span>
      </div>
    `;
  });
}

function openReport(id) {
  location.href = `admin_report.html?id=${id}`;
}

loadReports();
