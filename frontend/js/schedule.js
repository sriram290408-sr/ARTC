const API = "https://artc-backend.onrender.com";
const container = document.getElementById("scheduleContainer");

async function loadSchedule() {
  try {
    const res = await fetch(`${API}/schedule`);
    const data = await res.json();
    container.innerHTML = "";

    if (!data.length) {
      container.innerHTML = "<p>No schedules available</p>";
      return;
    }

    data.forEach(item => {
      container.innerHTML += `
        <div class="schedule-card">
          <h3>${item.event_name}</h3>
          <p><strong>Date:</strong> ${new Date(item.datetime).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(item.datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          <p><strong>Venue:</strong> ${item.venue}</p>
        </div>
      `;
    });
  } catch {
    container.innerHTML = "<p>Error loading schedule</p>";
  }
}

loadSchedule();
