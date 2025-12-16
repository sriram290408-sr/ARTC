// Get the canvas context (2D is required)
const ctx = document.getElementById("complaintChart").getContext("2d");

// Complaint data (example values)
const solved = 45;
const pending = 30;
const fake = 25;

// Calculate total
const total = solved + pending + fake;

// Create Pie Chart
new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Solved", "Pending", "Fake"],
    datasets: [
      {
        data: [solved, pending, fake],
        backgroundColor: [
          "#28a745", // green
          "#ffc107", // yellow
          "#dc3545"  // red
        ],
        borderColor: "#ffffff",
        borderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      }
    }
  }
});
