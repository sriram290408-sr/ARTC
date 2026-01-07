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
    showError("Title and Description are required");
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

  } catch (error) {
    console.error("Report submit error:", error);
    showError("Something went wrong. Please try again.");
  } finally {
    resetButton(submitBtn);
  }
});

function showError(msg) {
  messageBox.textContent = msg;
  messageBox.style.color = "red";
}

function resetButton(btn) {
  btn.disabled = false;
  btn.textContent = "Submit Complaint";
}
