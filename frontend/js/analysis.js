const API = "https://artc-backend.onrender.com";

let chart;

async function loadUserAnalysis() {
  const canvas = document.getElementById("complaintChart");
  if (!canvas) return;

  try {
    const res = await fetch(`${API}/reports/analytics`);

    if (!res.ok) throw new Error();

    const data = await res.json();

    if (chart) chart.destroy();

    chart = new Chart(canvas.getContext("2d"), {
      type: "pie",
      data: {
        labels: ["Solved", "Pending", "Fake"],
        datasets: [{
          data: [
            data.completed || 0,
            data.pending || 0,
            data.fake || 0
          ],
          backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
          borderWidth: 0
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

  } catch {
    canvas.outerHTML =
      "<p style='color:red;text-align:center'>Unable to load analysis</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadUserAnalysis);
