const API = "https://artc-backend.onrender.com";
const container = document.getElementById("historyContainer");

document.addEventListener("DOMContentLoaded", loadReports);

async function loadReports() {
  container.innerHTML = "<p>Loading reports...</p>";

  try {
    const res = await fetch(`${API}/reports`);

    if (!res.ok) throw new Error("Failed to fetch reports");

    const reports = await res.json();
    container.innerHTML = "";

    if (reports.length === 0) {
      container.innerHTML = "<p>No reports found.</p>";
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

      card.addEventListener("click", () => {
        localStorage.setItem("selected_report_id", report.id);
        window.location.href = "../html/admin_report.html";
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Error loading reports.</p>";
  }
}
