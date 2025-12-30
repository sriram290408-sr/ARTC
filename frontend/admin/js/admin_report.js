const API = "http://127.0.0.1:8000";

const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");

if (!reportId) {
  alert("No report selected");
  location.href = "admin_report-history.html";
}

async function loadReport() {
  const res = await fetch(`${API}/reports/${reportId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const r = await res.json();

  document.getElementById("caseMeta").innerText =
    `Report ID: #${r.id} | Submitted: ${formatDate(r.created_at)}`;

  title.value = r.title;
  description.value = r.description;
  problem_type.value = r.problem_type;
  incident_location.value = r.incident_location;
  incident_date.value = r.incident_date;
  name.value = r.name;
  class_section.value = r.class_section;
  people_involved.value = r.people_involved || "-";
  status.value = r.status;
}

async function updateReport() {
  await fetch(`${API}/reports/${reportId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      status: status.value,
      remarks: remarks.value
    })
  });

  alert("Report updated successfully");
  location.href = "admin_report-history.html";
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN");
}

loadReport();
