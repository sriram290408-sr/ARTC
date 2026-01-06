const BASE_URL = "https://artc-backend.onrender.com";

async function createSchedule(title, date, time) {
  const res = await fetch(`${BASE_URL}/schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify({ title, date, time })
  });

  return res.json();
}

async function viewSchedules() {
  const res = await fetch(`${BASE_URL}/schedules`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  return res.json();
}

async function deleteSchedule(id) {
  const res = await fetch(`${BASE_URL}/schedules/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  return res.json();
}
