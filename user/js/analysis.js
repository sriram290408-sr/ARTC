const canvas = document.getElementById("complaintChart");
const ctx = canvas.getContext("2d");

const data = {
  solved: 45,
  pending: 30,
  fake: 25
};

new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Solved", "Pending", "Fake"],
    datasets: [{
      data: [data.solved, data.pending, data.fake],
      backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
      borderWidth: 0
    }]
  },
  options: {
    responsive: false,       
    maintainAspectRatio: true 
  }
});
