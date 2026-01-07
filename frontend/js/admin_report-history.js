const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("token");

const container = document.getElementById("historyContainer");
const sortSelect = document.getElementById("sortSelect");

async function loadReports(sort = "latest") {
  try {
    const res = await fetch(`${API}/reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error();

    let reports = await res.json();

    reports.sort((a, b) =>
      sort === "latest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

    container.innerHTML = "";

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

      card.onclick = () => {
        location.href = `./admin_report.html?id=${r.id}`;
      };

      container.appendChild(card);
    });

  } catch (err) {
    container.innerHTML = "<p>Failed to load reports</p>";
  }
}

sortSelect.addEventListener("change", (e) => {
  loadReports(e.target.value);
});

loadReports();
