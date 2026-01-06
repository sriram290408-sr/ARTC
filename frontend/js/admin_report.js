const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("token");

const form = document.getElementById("reportForm");
const message = document.getElementById("formMessage");
const statusDropdown = document.getElementById("status");

const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");

if (!reportId) {
  alert("No report selected");
  location.href = "./admin_report-history.html";
}

// Load report data from backend
async function loadReport() {
  try {
    const res = await fetch(`${API}/reports/${reportId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch report");

    const r = await res.json();

    // Fill form fields
    form.title.value = r.title;
    form.description.value = r.description;
    form.problem_type.value = r.problem_type;
    form.incident_location.value = r.incident_location;
    form.incident_date.value = r.incident_date;
    form.name.value = r.name;
    form.class_section.value = r.class_section;
    form.people_involved.value = r.people_involved || "";
    form.status.value = r.status;
    form.remarks.value = r.remarks || "";

    // Set color for status
    setStatusColor(r.status);
  } catch (err) {
    alert("Failed to load report");
    console.error(err);
  }
}

// Set color based on status
function setStatusColor(status) {
  statusDropdown.className = ""; // remove old class
  switch (status) {
    case "Pending":
      statusDropdown.classList.add("status-pending");
      break;
    case "Under Review":
      statusDropdown.classList.add("status-under_review");
      break;
    case "Completed":
      statusDropdown.classList.add("status-completed");
      break;
    case "Fake":
      statusDropdown.classList.add("status-fake");
      break;
  }
}

// Listen to status change to update color immediately
statusDropdown.addEventListener("change", () => {
  setStatusColor(statusDropdown.value);
});

// Submit updated report to backend
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    status: form.status.value,
    remarks: form.remarks.value
  };

  try {
    const res = await fetch(`${API}/reports/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Update failed");

    message.innerText = "Report updated successfully ✅";
    message.style.color = "green";

    // Update color immediately
    setStatusColor(form.status.value);

    setTimeout(() => {
      location.href = "./admin_report-history.html";
    }, 1200);
  } catch (err) {
    message.innerText = "Update failed ❌";
    message.style.color = "red";
    console.error(err);
  }
});

loadReport();
