const API = "https://artc-backend.onrender.com";
const id = new URLSearchParams(location.search).get("id");

async function loadReport() {
  const res = await fetch(`${API}/reports/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const r = await res.json();
  document.getElementById("title").value = r.title;
  document.getElementById("status").value = r.status;
}

async function updateStatus() {
  const status = document.getElementById("status").value;

  await fetch(`${API}/reports/${id}?status=${status}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  alert("Updated");
  location.href = "admin_report-history.html";
}

loadReport();
