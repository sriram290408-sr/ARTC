document.getElementById("reportForm").addEventListener("submit", async function (e) {
  e.preventDefault(); 

  const formData = {
    title: this.title.value,
    description: this.description.value,
    problem_type: this.problem_type.value,
    incident_location: this.incident_location.value,
    incident_date: this.incident_date.value,
    name: this.name.value,
    class_section: this.class_section.value,
    people_involved: this.people_involved.value || null,
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/reports/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      this.reset();
    } else {
      alert("Failed to submit report: " + (result.detail || "Unknown error"));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while submitting the report.");
  }
});
