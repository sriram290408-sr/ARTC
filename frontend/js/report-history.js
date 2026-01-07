const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("token");
const container = document.getElementById("historyContainer");

async function loadReports() {
  try {
    const res = await fetch(`${API}/reports/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error();

    const reports = await res.json();
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

      container.appendChild(card);
    });

  } catch {
    container.innerHTML = "<p>Failed to load reports</p>";
  }
}

loadReports();
