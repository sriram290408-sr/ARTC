const API = "https://artc-backend.onrender.com";
const container = document.getElementById("historyContainer");

async function loadMyReports() {
  try {
    const res = await fetch(`${API}/reports`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch reports");
    }

    const reports = await res.json();
    container.innerHTML = "";

    if (!reports || reports.length === 0) {
      container.innerHTML = "<p>No reports found.</p>";
      return;
    }

    reports.forEach(r => {
      container.innerHTML += `
        <div class="report-card">
          <h3>${r.title}</h3>
          <p>${r.description}</p>
          <span>Status: ${r.status}</span>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading reports</p>";
  }
}

loadMyReports();
