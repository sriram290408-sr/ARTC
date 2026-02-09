import apiFetch from "./apiClient.js";

let chartInstance = null;

// Register plugin from CDN
window.Chart.register(window.ChartDataLabels);

document.addEventListener("DOMContentLoaded", () => {
  loadAnalysis();
  setInterval(loadAnalysis, 10000);
});

async function loadAnalysis() {
  try {
    const data = await apiFetch("/reports/analytics");

    const total =
      (data.pending || 0) +
      (data.under_review || 0) +
      (data.completed || 0) +
      (data.fake || 0);

    document.getElementById("totalCount").textContent = total;

    renderChart(data);

  } catch (err) {
    console.error("Analytics failed:", err);
  }
}

function renderChart(data) {
  const canvas = document.getElementById("complaintChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const values = [
    data.pending || 0,
    data.under_review || 0,
    data.completed || 0,
    data.fake || 0
  ];

  const hasData = values.some(v => v > 0);
  const finalData = hasData ? values : [1, 1, 1, 1];

  const total = finalData.reduce((a, b) => a + b, 0);

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
        legend: { position: "bottom" },
        datalabels: {
          color: "#fff",
          formatter: value =>
            total ? ((value / total) * 100).toFixed(1) + "%" : ""
        }
      }
    }
  });
}
