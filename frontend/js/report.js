const form = document.getElementById("reportForm");
const formMessage = document.getElementById("formMessage");

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
      formMessage.style.color = "green";
      formMessage.innerText = "Complaint submitted successfully!";
      form.reset();
    } else {
      formMessage.style.color = "red";
      formMessage.innerText = "Failed: " + (result.detail || "Something went wrong");
    }
  } catch (err) {
    formMessage.style.color = "red";
    formMessage.innerText = "Server error. Try again later.";
    console.error(err);
  }
});
