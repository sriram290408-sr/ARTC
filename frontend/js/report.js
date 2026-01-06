const API = "https://artc-backend.onrender.com";

const form = document.getElementById("reportForm");
const messageEl = document.getElementById("formMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    title: form.title.value,
    description: form.description.value,
    problem_type: form.problem_type.value,
    incident_location: form.incident_location.value,
    incident_date: form.incident_date.value,
    name: form.name.value,
    class_section: form.class_section.value,
    people_involved: form.people_involved.value
  };

  const res = await fetch(`${API}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    messageEl.style.color = "red";
    messageEl.textContent = "Failed to submit report";
    return;
  }

  messageEl.style.color = "green";
  messageEl.textContent = "Report submitted successfully";
  form.reset();
});
