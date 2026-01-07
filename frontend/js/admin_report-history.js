const API = "https://artc-backend.onrender.com";

const historyContainer = document.getElementById("historyContainer");
const sortSelect = document.getElementById("sortSelect");

// ---------------- LOAD ALL REPORTS ----------------
async function loadAdminReports(sort = "latest") {
  try {
    const res = await fetch(`${API}/reports`);

    if (!res.ok) throw new Error("Failed to fetch");

    let reports = await res.json();

    // Sort by created date
    reports.sort((a, b) =>
      sort === "latest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

    historyContainer.innerHTML = "";

    reports.forEach((r) => {
      const card = document.createElement("div");
      card.className = "history-card";

      card.innerHTML = `
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <span class="status status-${r.status.replace(" ", "_")}">
          ${r.status}
        </span>
      `;

      // Redirect to admin update page
      card.addEventListener("click", () => {
        window.location.href = `./admin_report.html?id=${r.id}`;
      });

      historyContainer.appendChild(card);
    });
  } catch (err) {
    historyContainer.innerHTML = "<p>Failed to load reports</p>";
  }
}

// ---------------- SORT ----------------
sortSelect.addEventListener("change", (e) => {
  loadAdminReports(e.target.value);
});

// Initial load
loadAdminReports();
