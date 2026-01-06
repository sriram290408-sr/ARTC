const API = "https://artc-backend.onrender.com";
const container = document.getElementById("historyContainer");

async function loadMyReports() {
  const res = await fetch(`${API}/reports/my`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const reports = await res.json();
  container.innerHTML = "";

  reports.forEach(r => {
    container.innerHTML += `
      <div class="report-card">
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <span>Status: ${r.status}</span>
      </div>
    `;
  });
}

loadMyReports();
