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

    renderChart(data);
  } catch (err) {
    console.error(err);
  }
}

function renderChart(data) {
  const canvas = document.getElementById("complaintChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const chartData = [
    data.pending || 0,
    data.under_review || 0,
    data.completed || 0,
    data.fake || 0
  ];

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
        backgroundColor: [
          "#f59e0b", 
          "#3b82f6", 
          "#10b981", 
          "#ef4444" 
        ],
        borderColor: "#ffffff",
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle"
          }
        },
        tooltip: {
          backgroundColor: "#111827"
        },
        datalabels: {
          color: "#ffffff",
          font: {
            weight: "bold",
            size: 14
          },
          formatter: (value, ctx) => {
            const total = ctx.chart.data.datasets[0].data
              .reduce((a, b) => a + b, 0);
            if (value === 0) return "";
            return ((value / total) * 100).toFixed(1) + "%";
          }
        }
      }
    }
  });
}
