// for local host
// const API = "http://127.0.0.1:8000"; 
// for render
// const API = "https://artc-backend.onrender.com";
// for vercel
const API = "https://artc-seven.vercel.app";


let chart;

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

    document.getElementById("totalCount").textContent =
      values.reduce((a, b) => a + b, 0);

    drawChart(values);
  } catch (err) {
    console.error("Error loading analytics:", err);
  }
}

function drawChart(values) {
  const ctx = document.getElementById("complaintChart");

  if (!ctx) return;

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
        legend: { position: "bottom" },
        datalabels: {
          color: "#fff",
          formatter: (value, ctx) => {
            const total = ctx.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0
            );
            if (!total) return "";
            return ((value / total) * 100).toFixed(1) + "%";
          },
        },
      },
    },
  });
}
