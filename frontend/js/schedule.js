const BASE_URL = "https://artc-backend.onrender.com";

async function viewSchedules() {
  const res = await fetch(`${BASE_URL}/schedules`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  return res.json();
}
