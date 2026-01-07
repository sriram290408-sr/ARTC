const API_URL = "https://artc-backend.onrender.com";

const reportForm = document.getElementById("reportForm");
const messageBox = document.getElementById("formMessage");

reportForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  messageBox.textContent = "";
  messageBox.style.color = "green";

  const submitBtn = reportForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const formData = new FormData(reportForm);

  const payload = {
    title: formData.get("title")?.trim(),
    description: formData.get("description")?.trim(),
    problem_type: formData.get("problem_type"),
    incident_location: formData.get("incident_location")?.trim(),
    incident_date: formData.get("incident_date"),
    name: formData.get("name")?.trim(),
    class_section: formData.get("class_section")?.trim(),
    people_involved: formData.get("people_involved")?.trim() || null
  };

  if (!payload.title || !payload.description) {
    messageBox.textContent = "Title and Description are required";
    messageBox.style.color = "red";
    resetButton(submitBtn);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.detail || "Failed to submit report");
    }

    messageBox.textContent = "Complaint submitted successfully ✅";
    messageBox.style.color = "green";
    reportForm.reset();

  } catch (err) {
    messageBox.textContent = err.message || "Submission failed";
    messageBox.style.color = "red";
  } finally {
    resetButton(submitBtn);
  }
});

function resetButton(btn) {
  btn.disabled = false;
  btn.textContent = "Submit Complaint";
}
