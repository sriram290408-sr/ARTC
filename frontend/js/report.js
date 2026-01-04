const form = document.getElementById("reportForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 
  
  const data = {
    title: form.title.value,
    description: form.description.value,
    problem_type: form.problem_type.value,
    incident_location: form.incident_location.value,
    incident_date: form.incident_date.value,
    name: form.name.value,
    class_section: form.class_section.value,
    people_involved: form.people_involved.value || null,
  };

  try {
    const res = await fetch("https://artc-backend.onrender.com/reports/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message);
      form.reset();
    } else {
      alert("Failed: " + (result.detail || "Something went wrong"));
    }
  } catch (err) {
    alert("Server error. Try again later.");
    console.error(err);
  }
});
