const API = "https://artc-backend.onrender.com";
const container = document.getElementById("scheduleContainer");

async function loadSchedules() {
  const res = await fetch(`${API}/schedules`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  const schedules = await res.json();
  container.innerHTML = "";

  // 🔥 ADD THIS
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredSchedules = schedules.filter(s => {
    const eventDate = new Date(s.date);
    return eventDate >= today;
  });

  // 🔥 use filtered instead of original
  filteredSchedules.forEach(s => {
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
