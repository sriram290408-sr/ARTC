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
    if (!res.ok) throw new Error("Failed to load analytics");

    const data = await res.json();

    const chartData = [
      data.pending || 0,
      data.under_review || 0,
      data.completed || 0,
      data.fake || 0
    ];

    const total = chartData.reduce((a, b) => a + b, 0);
    document.getElementById("totalCount").textContent = total;

    renderChart(chartData);
  } catch (err) {
    console.error(err);
  }
}

function renderChart(chartData) {
  const canvas = document.getElementById("complaintChart");
  const noDataMsg = document.getElementById("noDataMsg");

  const total = chartData.reduce((a, b) => a + b, 0);

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

  const ctx = canvas.getContext("2d");

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
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle"
          }
        },
        datalabels: {
          color: "#ffffff",
          formatter: (value, ctx) => {
            const total = ctx.chart.data.datasets[0].data
              .reduce((a, b) => a + b, 0);

            if (total === 0) return "";
            return ((value / total) * 100).toFixed(1) + "%";
          }
        }
      }
    }
  });
}
