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
          data: finalData,
          backgroundColor: ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"],
          borderColor: "#fff",
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        datalabels: {
          color: "#fff",
          formatter: (value, ctx) => {
            if (!hasData) return "";
            const total = ctx.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0,
            );
            return ((value / total) * 100).toFixed(1) + "%";
          },
        },
      },
    },
  });
}
