import API from "./config.js";

let chartInstance = null;

// Register plugin from CDN safely
window.Chart.register(window.ChartDataLabels);

document.addEventListener("DOMContentLoaded", () => {
  loadAnalysis();
  setInterval(loadAnalysis, 10000);
});

async function loadAnalysis() {
  try {
    const res = await fetch(`${API}/reports/analytics`);

    if (!res.ok) {
      throw new Error(`Analytics failed: ${res.status}`);
    }

    const data = await res.json();

    const total =
      (data.pending || 0) +
      (data.under_review || 0) +
      (data.completed || 0) +
      (data.fake || 0);

    document.getElementById("totalCount").textContent = total;

    renderChart(data);
  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
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

  const hasData = chartData.some(v => v > 0);
  const finalData = hasData ? chartData : [1, 1, 1, 1];

  if (chartInstance) {
    chartInstance.data.datasets[0].data = finalData;
    chartInstance.update();
    return;
  }

  chartInstance = new window.Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Pending", "Under Review", "Completed", "Fake"],
      datasets: [
        {
          data: finalData,
          backgroundColor: [
            "#f59e0b",
            "#3b82f6",
            "#10b981",
            "#ef4444"
          ],
          borderColor: "#fff",
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
          color: "#fff",
          formatter: (value, ctx) => {
            if (!hasData) return "";

            const total = ctx.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0
            );

            return ((value / total) * 100).toFixed(1) + "%";
          }
        }
      }
    }
  });
}
