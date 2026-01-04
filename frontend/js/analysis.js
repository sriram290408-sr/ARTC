const API = "https://artc-backend.onrender.com";

const canvas = document.getElementById("complaintChart");
const ctx = canvas.getContext("2d");

async function loadUserAnalysis() {
  try {
    const res = await fetch(`${API}/reports/analytics/public`);
    const data = await res.json();

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Solved", "Pending", "Fake"],
        datasets: [
          {
            data: [
              data.completed,
              data.pending,
              data.fake
            ],
            backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    });

  } catch {
    canvas.outerHTML =
      "<p style='color:red;text-align:center'>Unable to load analysis</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadUserAnalysis);
