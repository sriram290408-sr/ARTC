const API = "https://artc-backend.onrender.com";
const container = document.getElementById("historyContainer");

async function loadAllReports() {
  const res = await fetch(`${API}/reports`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  if (!res.ok) {
    container.innerHTML = "<p>Failed to load reports</p>";
    return;
  }

  const reports = await res.json();
  container.innerHTML = "";

  reports.forEach(r => {
    container.innerHTML += `
      <div class="report-card" data-id="${r.id}">
        <h3>${r.title}</h3>
        <p><strong>Student:</strong> ${r.name}</p>
        <p>Status: ${r.status}</p>
      </div>
    `;
  });

  document.querySelectorAll(".report-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      window.location.href = `report.html?id=${id}`;
    });
  });
}

loadAllReports();
