const API = "https://artc-backend.onrender.com";

let chartInstance = null;

async function loadUserAnalysis() {
  const canvas = document.getElementById("complaintChart");
  if (!canvas) return;

  try {
    const res = await fetch(`${API}/reports/analytics/public`);
    if (!res.ok) throw new Error();

    const data = await res.json();

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(canvas, {
      type: "pie",
      data: {
        labels: ["Completed", "Pending", "Fake"],
        datasets: [
          {
            data: [
              data.completed || 0,
              data.pending || 0,
              data.fake || 0
            ],
            backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
            borderWidth: 0
          }
        ]
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

  } catch {
    canvas.outerHTML =
      "<p style='color:red;text-align:center'>Unable to load analysis</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadUserAnalysis);
