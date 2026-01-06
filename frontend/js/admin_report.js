const API = "https://artc-backend.onrender.com";
const form = document.getElementById("reportForm");
const messageEl = document.getElementById("formMessage");

const urlParams = new URLSearchParams(window.location.search);
const reportId = urlParams.get("id");

async function loadReportForAdmin() {
  if (!reportId) return;

  const res = await fetch(`${API}/reports/${reportId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  if (!res.ok) {
    alert("Failed to load report");
    return;
  }

  const r = await res.json();

  form.title.value = r.title;
  form.description.value = r.description;
  form.problem_type.value = r.problem_type;
  form.incident_location.value = r.incident_location;
  form.incident_date.value = r.incident_date;
  form.name.value = r.name;
  form.class_section.value = r.class_section;
  form.people_involved.value = r.people_involved || "";
}

form.addEventListener("submit", async (e) => {
  if (!reportId) return; 
  e.preventDefault();

  const payload = {
    status: "Verified"
  };

  const res = await fetch(`${API}/reports/${reportId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    messageEl.style.color = "red";
    messageEl.textContent = "Update failed";
    return;
  }

  messageEl.style.color = "green";
  messageEl.textContent = "Report verified successfully";

  form.reset();

  setTimeout(() => {
    window.location.href = "report-history.html";
  }, 1200);
});

loadReportForAdmin();
