const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("access_token");

const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");

async function loadReport() {
  const res = await fetch(`${API}/reports/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const reports = await res.json();
  const report = reports.find(r => r.id == reportId);

  document.getElementById("title").value = report.title;
  document.getElementById("description").value = report.description;
  document.getElementById("status").value = report.status;
}

document.getElementById("updateForm").addEventListener("submit", async e => {
  e.preventDefault();

  await fetch(`${API}/reports/${reportId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: document.getElementById("title").value,
      content: document.getElementById("description").value
    })
  });

  alert("Report updated");
  window.location.href = "admin_report-history.html";
});

loadReport();
