const BASE_URL = "https://artc-backend.onrender.com";

async function createReport(title, content) {
  const res = await fetch(`${BASE_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify({ title, content })
  });

  return res.json();
}

async function viewMyReports() {
  const res = await fetch(`${BASE_URL}/reports/my`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  return res.json();
}
