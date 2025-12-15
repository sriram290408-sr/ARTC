document.addEventListener("DOMContentLoaded", () => {
  const reportForm = document.getElementById("reportForm");

  if (!reportForm) {
    console.error("Report form not found");
    return;
  }

  reportForm.addEventListener("submit", submitReport);
});

async function submitReport(e) {
  e.preventDefault();

  const form = e.target;

  const payload = {
    title: form.querySelector("#title")?.value.trim(),
    description: form.querySelector("#description")?.value.trim(),
    category: form.querySelector("#category")?.value || "General"
  };

  if (!payload.title || !payload.description) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const response = await fetch("http://127.0.0.1:8000/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", 
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Failed to submit complaint");
    }

    alert("Complaint submitted successfully");

    form.reset();

    window.location.href = "./profile.html";

  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
  }
}
