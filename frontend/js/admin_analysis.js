const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("token");

async function loadAnalysis() {
  try {
    const res = await fetch(`${API}/reports/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load analytics");
    }

    const data = await res.json();
    renderChart(data);
  } catch (err) {
    console.error(err);
    alert("Unable to load analysis data");
  }
}

function renderChart(data) {
  const canvas = document.getElementById("complaintChart");
  if (!canvas) {
    console.error("Canvas not found");
    return;
  }

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Pending", "Verified"],
      datasets: [{
        data: [
          data.pending || 0,
          data.verified || 0
        ],
        backgroundColor: ["#e67e22", "#27ae60"]
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

loadAnalysis();
