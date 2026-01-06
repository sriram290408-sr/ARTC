const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("token");

let chartInstance = null;

async function loadAnalytics() {
  const canvas = document.getElementById("complaintChart");
  if (!canvas) return;

  try {
    const res = await fetch(`${API}/reports/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: ["Pending", "Completed", "Fake"],
        datasets: [
          {
            data: [
              data.pending || 0,
              data.completed || 0,
              data.fake || 0
            ],
            backgroundColor: ["#ffc107", "#28a745", "#dc3545"],
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
      "<p style='color:red;text-align:center'>Admin access required</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadAnalytics);
