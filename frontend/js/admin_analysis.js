import API from "./config.js";

let chart;

// Register DataLabels plugin
Chart.register(ChartDataLabels);

document.addEventListener("DOMContentLoaded", () => {
  loadData();
});

async function loadData() {
  try {
    const res = await fetch(`${API}/reports/analytics`);
    const data = await res.json();

    const values = [
      data.pending || 0,
      data.under_review || 0,
      data.completed || 0,
      data.fake || 0,
    ];

    const total = values.reduce((a, b) => a + b, 0);
    document.getElementById("totalCount").textContent = total;

    drawChart(values);
  } catch (err) {
    console.error("Error loading analytics:", err);
  }
}

function drawChart(values) {
  const ctx = document.getElementById("complaintChart").getContext("2d");

  if (chart) {
    chart.data.datasets[0].data = values;
    chart.update();
    return;
  }

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Pending", "Under Review", "Completed", "Fake"],
      datasets: [
        {
          data: values,
          backgroundColor: ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
        datalabels: {
          color: "#fff",
          formatter: (value, ctx) => {
            const total = ctx.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0,
            );
            if (total === 0) return "";
            return ((value / total) * 100).toFixed(1) + "%";
          },
        },
      },
    },
  });
}
