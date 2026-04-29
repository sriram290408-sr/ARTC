import API from "./config.js";

const reportForm = document.getElementById("reportForm");
const messageBox = document.getElementById("formMessage");

reportForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  messageBox.textContent = "";
  const submitBtn = reportForm.querySelector("button");
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const formData = new FormData(reportForm);
  console.log(formData)

  const payload = Object.fromEntries(formData.entries());
  console.log(payload)

  try {
    const res = await fetch(`${API}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error();

    messageBox.style.color = "green";
    messageBox.textContent = "Complaint submitted successfully";
    reportForm.reset();

  } catch {
    messageBox.style.color = "red";
    messageBox.textContent = "Submission failed";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Complaint";
  }
});
