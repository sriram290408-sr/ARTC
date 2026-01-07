const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("token");
const container = document.getElementById("historyContainer");

const role = localStorage.getItem("role"); 

async function loadReports() {
  try {
    const endpoint = role === "faculty" ? "/report" : "/report"; 
    const res = await fetch(`${API}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch reports");

    const reports = await res.json();
    container.innerHTML = "";

    if (!reports.length) {
      container.innerHTML = "<p>No reports found</p>";
      return;
    }

    reports.forEach(r => {
      const card = document.createElement("div");
      card.className = "report-card";

      if (role === "faculty") {
        card.onclick = () => location.href = `./admin_report.html?id=${r.id}`;
      }

      card.innerHTML = `
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <p><small>Status: ${r.status || "Pending"} | ${new Date(r.created_at).toLocaleString()}</small></p>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading reports</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadReports);
