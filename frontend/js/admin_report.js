const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");
const formMessage = document.getElementById("formMessage");

if (!reportId) {
  formMessage.innerText = "Invalid report ID";
}

async function loadReport() {
  try {
    const res = await fetch(`${API}/reports/${reportId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error();

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

  } catch {
    formMessage.innerText = "Failed to load report";
  }
}

loadReport();

document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = document.getElementById("status").value;

  try {
    const res = await fetch(`${API}/reports/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error();

    formMessage.style.color = "green";
    formMessage.innerText = "Report updated successfully";

  } catch {
    formMessage.style.color = "red";
    formMessage.innerText = "Update failed";
  }
});
