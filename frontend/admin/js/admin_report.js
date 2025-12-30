const API = "https://YOUR_RENDER_URL";

async function loadReports() {
  const res = await fetch(`${API}/reports`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const reports = await res.json();
  const table = document.getElementById("reportTable");
  table.innerHTML = "";

  reports.forEach(r => {
    table.innerHTML += `
      <tr>
        <td>${r.title}</td>
        <td>${r.problem_type}</td>
        <td>
          <select onchange="updateStatus(${r.id}, this.value)">
            <option ${r.status==="pending"?"selected":""}>pending</option>
            <option ${r.status==="fake"?"selected":""}>fake</option>
            <option ${r.status==="completed"?"selected":""}>completed</option>
          </select>
        </td>
        <td>
          <button onclick="deleteReport(${r.id})">Delete</button>
        </td>
      </tr>`;
  });
}

async function updateStatus(id, status) {
  await fetch(`${API}/reports/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ status })
  });
}

async function deleteReport(id) {
  if (!confirm("Delete this report?")) return;

  await fetch(`${API}/reports/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  loadReports();
}

loadReports();
