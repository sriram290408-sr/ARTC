const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("token");

const form = document.getElementById("reportForm");
const message = document.getElementById("formMessage");

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
    people_involved: form.people_involved.value || null
  };

  try {
    const res = await fetch(`${API}/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error();

    message.innerText = "Report submitted successfully";
    message.style.color = "green";
    form.reset();
  } catch {
    message.innerText = "Failed to submit report";
    message.style.color = "red";
  }
});
