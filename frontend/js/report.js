const API_URL = "https://artc-backend.onrender.com";
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", fetchReports);

async function fetchReports() {
  const container = document.getElementById("reportContainer");
  container.innerHTML = "";

  try {
    const res = await fetch(`${API_URL}/reports/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const reports = await res.json();

    if (!reports.length) {
      container.innerHTML = "<p>No reports submitted</p>";
      return;
    }

    reports.forEach(r => {
      const card = document.createElement("div");
      card.className = "report-card";

      card.innerHTML = `
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <p><small>By: ${r.created_by} | ${new Date(r.created_at).toLocaleString()}</small></p>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading reports</p>";
  }
}

document.getElementById("reportForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById("report_title").value,
    description: document.getElementById("report_description").value
  };

  try {
    const res = await fetch(`${API_URL}/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("Report submitted");
      fetchReports();
      e.target.reset();
    } else {
      const err = await res.json();
      alert(err.detail || "Failed to submit report");
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  }
});
