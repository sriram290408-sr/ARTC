const API = "https://artc-backend.onrender.com";

const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");

if (!reportId) {
  alert("No report selected");
  location.href = "admin_report-history.html";
}

const title = document.getElementById("title");
const description = document.getElementById("description");
const problem_type = document.getElementById("problem_type");
const incident_location = document.getElementById("incident_location");
const incident_date = document.getElementById("incident_date");
const name = document.getElementById("name");
const class_section = document.getElementById("class_section");
const people_involved = document.getElementById("people_involved");
const status = document.getElementById("status");
const remarks = document.getElementById("remarks");
const updateBtn = document.getElementById("updateBtn");

async function loadReport() {
  try {
    const res = await fetch(`${API}/reports/${reportId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch report");

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
    remarks.value = r.remarks || "";
  } catch (err) {
    alert("Error loading report: " + err.message);
    location.href = "admin_report-history.html";
  }
}

async function updateReport() {
  try {
    updateBtn.disabled = true;
    await fetch(`${API}/reports/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        status: status.value,
        remarks: remarks.value.trim()
      })
    });
    alert("Report updated successfully");
    location.href = "admin_report-history.html";
  } catch (err) {
    alert("Error updating report: " + err.message);
  } finally {
    updateBtn.disabled = false;
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN");
}

loadReport();
