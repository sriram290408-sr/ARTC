const API = "https://artc-backend.onrender.com"; 
const container = document.getElementById("historyContainer");
const sortSelect = document.getElementById("sortSelect");

document.addEventListener("DOMContentLoaded", () => {
  loadReports();
  sortSelect.addEventListener("change", loadReports);
});

async function loadReports() {
  container.innerHTML = "<p>Loading reports...</p>";
  console.log("Loading reports...");

  try {
    const res = await fetch(`${API}/reports`);
    console.log("Fetch response:", res);

    if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`);

    let reports = await res.json();
    console.log("Reports data:", reports);

    // Handle sorting
    const sortOrder = sortSelect.value;
    reports.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

    container.innerHTML = "";

    if (!reports || reports.length === 0) {
      container.innerHTML = "<p>No reports found.</p>";
      console.log("No reports found.");
      return;
    }

    reports.forEach(report => {
      const card = document.createElement("div");
      card.className = "report-card";

      card.innerHTML = `
        <h3>${report.title}</h3>
        <p>${report.description}</p>
        <p>
          <small>
            Status: <strong>${report.status || "Pending"}</strong><br/>
            Submitted on: ${new Date(report.created_at).toLocaleString()}
          </small>
        </p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading reports:", error);
    container.innerHTML = "<p>Error loading reports. Check console for details.</p>";
  }
}
