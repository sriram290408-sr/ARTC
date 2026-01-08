const API = "https://artc-backend.onrender.com";
let chartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  loadAnalysis();
  setInterval(loadAnalysis, 10000);
});

async function loadAnalysis() {
  try {
    const res = await fetch(`${API}/reports/analytics`);
    if (!res.ok) throw new Error("Failed to load analytics");

    const data = await res.json();

    document.getElementById("totalCount").textContent = data.total ?? 0;

    if (!data.total || data.total === 0) return;

    renderChart(data);
  } catch (err) {
    console.error("Analytics error:", err);
  }
}


function renderChart(chartData) {
  const ctx = document
    .getElementById("complaintChart")
    .getContext("2d");

  Chart.register(ChartDataLabels);

  if (chartInstance) {
    chartInstance.data.datasets[0].data = chartData;
    chartInstance.update();
    return;
  }

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Pending", "Under Review", "Completed", "Fake"],
      datasets: [{
        data: chartData,
        backgroundColor: ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"],
        borderWidth: 2
      }]
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
          color: "#fff",
          font: { weight: "bold" },
          formatter: (value, ctx) => {
            const total = ctx.chart.data.datasets[0].data
              .reduce((a, b) => a + b, 0);
            return value
              ? ((value / total) * 100).toFixed(1) + "%"
              : "";
          }
        }
      }
    }
  });
}
