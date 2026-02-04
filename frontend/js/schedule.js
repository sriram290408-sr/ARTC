import API from "./config";
const container = document.getElementById("scheduleContainer");

async function loadSchedules() {
  const res = await fetch(`${API}/schedules`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  const schedules = await res.json();
  container.innerHTML = "";

  schedules.forEach(s => {
    container.innerHTML += `
      <div class="schedule-card">
        <h3>${s.title}</h3>
        <p>${s.venue}</p>
        <p>${s.date} | ${s.time}</p>
      </div>
    `;
  });
}

loadSchedules();
