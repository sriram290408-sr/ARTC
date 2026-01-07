const API = "https://artc-backend.onrender.com";

const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");
const formMessage = document.getElementById("formMessage");

async function loadReport() {
  const res = await fetch(`${API}/reports/${reportId}`);
  const r = await res.json();

  document.getElementById("title").value = r.title;
  document.getElementById("description").value = r.description;
  document.getElementById("problem_type").value = r.problem_type;
  document.getElementById("incident_location").value = r.incident_location;
  document.getElementById("incident_date").value = r.incident_date;
  document.getElementById("name").value = r.name;
  document.getElementById("class_section").value = r.class_section;
  document.getElementById("people_involved").value = r.people_involved || "";
  document.getElementById("status").value = r.status;
}

loadReport();

document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = document.getElementById("status").value;

  const res = await fetch(`${API}/reports/${reportId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  if (res.ok) {
    formMessage.style.color = "green";
    formMessage.textContent = "Status updated successfully";
  } else {
    formMessage.style.color = "red";
    formMessage.textContent = "Update failed";
  }
});
