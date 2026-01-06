const API = "https://artc-backend.onrender.com";
const form = document.getElementById("reportForm");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    title: form.title.value,
    description: form.description.value,
    problem_type: form.problem_type.value,
    incident_location: form.incident_location.value,
    incident_date: form.incident_date.value,
    name: form.name.value,
    class_section: form.class_section.value,
    people_involved: form.people_involved.value || null
  };

  const res = await fetch(`${API}/reports/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Report submitted");
    form.reset();
  } else {
    alert("Submission failed");
  }
});
