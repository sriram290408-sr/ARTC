import API from "./config";

// Get report ID from URL
const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");

// Message container
const formMessage = document.getElementById("formMessage");

// Load report details and populate form
async function loadReport() {
  try {
    const res = await fetch(`${API}/reports/${reportId}`);
    if (!res.ok) throw new Error("Failed to fetch report");

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
  } catch (err) {
    console.error(err);
    formMessage.style.color = "red";
    formMessage.textContent = "Failed to load report details.";
  }
}

loadReport();

// Handle status update
document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = document.getElementById("status").value;

  try {
    const res = await fetch(`${API}/reports/${reportId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      // ✅ Redirect to report history after successful update
      window.location.href = "./admin_report-history.html";
    } else {
      formMessage.style.color = "red";
      formMessage.textContent = "Update failed";
    }
  } catch (err) {
    console.error(err);
    formMessage.style.color = "red";
    formMessage.textContent = "Update failed";
  }
});
