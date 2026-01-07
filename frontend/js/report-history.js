const API = "https://artc-backend.onrender.com";

const historyContainer = document.getElementById("historyContainer");
const sortSelect = document.getElementById("sortSelect");

const userName = prompt("Enter your name to view reports");

async function loadMyReports(sort = "latest") {
  try {
    const res = await fetch(`${API}/reports/my?name=${encodeURIComponent(userName)}`);
    let reports = await res.json();

    reports.sort((a, b) =>
      sort === "latest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

    historyContainer.innerHTML = "";

    reports.forEach(r => {
      historyContainer.innerHTML += `
        <div class="history-card">
          <h3>${r.title}</h3>
          <p>${r.description}</p>
          <span class="status">${r.status}</span>
        </div>
      `;
    });

  } catch {
    historyContainer.innerHTML = "<p>Failed to load reports</p>";
  }
}

sortSelect.addEventListener("change", e => loadMyReports(e.target.value));
loadMyReports();
