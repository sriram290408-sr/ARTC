const BASE_URL = "https://artc-backend.onrender.com";

async function viewAllReports() {
  const res = await fetch(`${BASE_URL}/reports`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  return res.json();
}

async function updateReport(id, title, content) {
  const res = await fetch(`${BASE_URL}/reports/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify({ title, content })
  });

  return res.json();
}
