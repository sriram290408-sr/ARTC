const API_BASE_URL = "http://127.0.0.1:8000";

document
  .querySelector(".complaint-form")
  .addEventListener("submit", submitReport);

async function submitReport(event) {
  event.preventDefault();

  const payload = {
    title: document.getElementById("type").value,
    description: document.getElementById("description").value,
    problem_type: document.getElementById("type").value,
    incident_location: document.getElementById("location").value,
    incident_date: document.getElementById("date").value,
    name: document.getElementById("name").value,
    class_section: document.getElementById("class").value,
    people_involved: document.getElementById("people").value || null
  };

  try {
    const response = await fetch(`${API_BASE_URL}/reports/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Submission failed");

    alert("Complaint submitted successfully");
    event.target.reset();

  } catch (error) {
    console.error(error);
    alert("Failed to submit complaint");
  }
}
