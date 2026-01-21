const API = "https://artc-backend.onrender.com";
let chartInstance = null;

Chart.register(ChartDataLabels);

document.addEventListener("DOMContentLoaded", () => {
  loadAnalysis();
  setInterval(loadAnalysis, 10000);
});

async function loadAnalysis() {
  try {
    const res = await fetch(`${API}/reports/analytics`);
    if (!res.ok) throw new Error("Failed to fetch analytics");

    const data = await res.json();

    // FORCE numeric values (critical)
    const pending = Number(data.pending) || 0;
    const underReview = Number(data.under_review) || 0;
    const completed = Number(data.completed) || 0;
    const fake = Number(data.fake) || 0;
    const total = Number(data.total) || 0;

    // Update total count (FROM BACKEND, NOT RE-CALCULATED)
    document.getElementById("totalCount").textContent = total;

    const chartData = [pending, underReview, completed, fake];
    renderChart(chartData, total);

  } catch (err) {
    console.error("Analytics load error:", err);
  }
}

function renderChart(chartData, total) {
  const canvas = document.getElementById("complaintChart");
  const noDataMsg = document.getElementById("noDataMsg");
  const ctx = canvas.getContext("2d");

  // ZERO reports → no chart
  if (total === 0) {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    canvas.style.display = "none";
    noDataMsg.style.display = "block";
    return;
  }

  canvas.style.display = "block";
  noDataMsg.style.display = "none";

  if (chartInstance) {
    chartInstance.data.datasets[0].data = chartData;
    chartInstance.update();
    return;
  }

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Pending", "Under Review", "Completed", "Fake"],
      datasets: [
        {
          data: chartData,
          backgroundColor: [
            "#f59e0b",
            "#3b82f6",
            "#10b981",
            "#ef4444"
          ],
          borderColor: "#ffffff",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true
          }
        },
        datalabels: {
          color: "#ffffff",
          formatter: (value, ctx) => {
            const sum = ctx.chart.data.datasets[0].data
              .reduce((a, b) => a + b, 0);
            if (sum === 0) return "";
            return ((value / sum) * 100).toFixed(1) + "%";
          }
        }
      }
    }
  });
}
