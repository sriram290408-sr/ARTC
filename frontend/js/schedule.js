const API_URL = "https://artc-backend.onrender.com";
const token = localStorage.getItem("access_token");

document.addEventListener("DOMContentLoaded", fetchSchedules);

async function fetchSchedules() {
  const container = document.getElementById("scheduleContainer");
  container.innerHTML = "";

  try {
    const res = await fetch(`${API_URL}/schedule/all`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const schedules = await res.json();

    if (!schedules.length) {
      container.innerHTML = "<p>No schedules available</p>";
      return;
    }

    schedules.forEach(s => {
      const card = document.createElement("div");
      card.className = "schedule-card";

      card.innerHTML = `
        <h3>${s.title}</h3>
        <p><strong>Date:</strong> ${s.date}</p>
        <p><strong>Time:</strong> ${s.time}</p>
        <p><strong>Venue:</strong> ${s.venue}</p>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading schedules</p>";
  }
}
