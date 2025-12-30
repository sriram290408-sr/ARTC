const API = "http://127.0.0.1:8000";
const token = localStorage.getItem("token");

async function loadAnalytics() {
  try {
    const res = await fetch(`${API}/reports/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    new Chart(document.getElementById("complaintChart"), {
      type: "doughnut",
      data: {
        labels: ["Pending", "Completed", "Fake"],
        datasets: [{
          data: [
            data.pending,
            data.completed,
            data.fake
          ],
          backgroundColor: ["#ffc107", "#28a745", "#dc3545"]
        }]
      }
    });

  } catch {
    document.getElementById("complaintChart").outerHTML =
      "<p style='color:red'>Admin access required</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadAnalytics);
