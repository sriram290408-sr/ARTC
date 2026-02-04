import API from "./config";

const historyContainer = document.getElementById("historyContainer");
const sortSelect = document.getElementById("sortSelect");

async function loadMyReports(sort = "latest") {
  try {
    const res = await fetch(`${API}/reports`);
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

  } catch (err) {
    console.error(err);
    historyContainer.innerHTML = "<p>Failed to load reports</p>";
  }
}

sortSelect.addEventListener("change", e => loadMyReports(e.target.value));
loadMyReports();
