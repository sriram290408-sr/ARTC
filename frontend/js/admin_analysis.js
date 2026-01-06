const API = "https://artc-backend.onrender.com";
const token = localStorage.getItem("token");

let chart;

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

    if (chart) chart.destroy();

    chart = new Chart(canvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Pending", "Completed", "Fake"],
        datasets: [{
          data: [
            data.pending || 0,
            data.completed || 0,
            data.fake || 0
          ],
          backgroundColor: ["#ffc107", "#28a745", "#dc3545"]
        }]
      }
    });

  } catch {
    canvas.outerHTML =
      "<p style='color:red;text-align:center'>Admin access required</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadAnalytics);
