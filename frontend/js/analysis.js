import apiFetch from "./apiClient.js";

let chartInstance = null;

// Register plugin from CDN
window.Chart.register(window.ChartDataLabels);

document.addEventListener("DOMContentLoaded", () => {
  loadUserAnalysis();
  setInterval(loadUserAnalysis, 10000);
});

async function loadUserAnalysis() {
  try {
    const username = localStorage.getItem("name");

    if (!username) {
      throw new Error("User not logged in");
    }

    // Fetch only this user's reports
    const reports = await apiFetch(
      `/reports/my?name=${encodeURIComponent(username)}`
    );

    const counts = {
      pending: 0,
      under_review: 0,
      completed: 0,
      fake: 0
    };

    reports.forEach(r => {
      if (counts[r.status] !== undefined) {
        counts[r.status]++;
      }
    });

    const total =
      counts.pending +
      counts.under_review +
      counts.completed +
      counts.fake;

    document.getElementById("totalCount").textContent = total;

    renderChart(counts);

  } catch (err) {
    console.error("USER ANALYTICS ERROR:", err);
  }
}

function renderChart(data) {
  const canvas = document.getElementById("complaintChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const values = [
    data.pending,
    data.under_review,
    data.completed,
    data.fake
  ];

  const hasData = values.some(v => v > 0);
  const finalData = hasData ? values : [1, 1, 1, 1];

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
