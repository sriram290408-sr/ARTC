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

    const total =
      (data.pending || 0) +
      (data.under_review || 0) +
      (data.completed || 0) +
      (data.fake || 0);

    document.getElementById("totalCount").textContent = total;

    if (total === 0) return; 

    renderChart(data, total);
  } catch (err) {
    console.error(err);
  }
}

function renderChart(data, total) {
  const canvas = document.getElementById("complaintChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const chartData = [
    data.pending || 0,
    data.under_review || 0,
    data.completed || 0,
    data.fake || 0
  ];

  // 🔴 REQUIRED FOR Chart.js v4
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
      datasets: [
        {
          data: chartData,
          backgroundColor: ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"],
          borderColor: "#ffffff",
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
        duration: 1200,
        easing: "easeOutQuart"
      },
      plugins: {
        legend: {
          position: "bottom"
        },
        datalabels: {
          color: "#fff",
          font: {
            weight: "bold",
            size: 14
          },
          formatter: (value) => {
            const percentage = ((value / total) * 100).toFixed(0);
            return percentage + "%";
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
