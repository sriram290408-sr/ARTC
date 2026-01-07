const API = "https://artc-backend.onrender.com";

document.addEventListener("DOMContentLoaded", loadAnalysis);

async function loadAnalysis() {
  try {
    const res = await fetch(`${API}/reports/analytics`);

    if (!res.ok) throw new Error("Failed to load analytics");

    const data = await res.json();
    renderChart(data);

  } catch (err) {
    console.error(err);
    alert("Unable to load analysis data");
  }
}

function renderChart(data) {
  const canvas = document.getElementById("complaintChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Pending", "Under Review", "Completed", "Fake"],
      datasets: [{
        data: [
          data.pending || 0,
          data.under_review || 0,
          data.completed || 0,
          data.fake || 0
        ],
        backgroundColor: [
          "#f39c12",
          "#3498db",
          "#2ecc71",
          "#e74c3c"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}
