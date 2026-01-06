const API_URL = "https://artc-backend.onrender.com";
const token = localStorage.getItem("access_token");

document.addEventListener("DOMContentLoaded", () => {
  fetchSchedules();
  document.getElementById("scheduleForm").addEventListener("submit", addSchedule);
});

async function fetchSchedules() {
  const container = document.getElementById("scheduleContainer");
  container.innerHTML = "";

  try {
    const res = await fetch(`${API_URL}/schedule/all`, {
      headers: { Authorization: `Bearer ${token}` }
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
        <input type="checkbox" class="select" data-id="${s.id}">
        <h3>${s.title}</h3>
        <p>Date: ${s.date}</p>
        <p>Time: ${s.time}</p>
        <p>Venue: ${s.venue}</p>
      `;

      container.appendChild(card);
    });

    document.getElementById("deleteBtn").style.display = "block";

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading schedules</p>";
  }
}

async function addSchedule(e) {
  e.preventDefault();

  const datetime = document.getElementById("datetime").value;
  const [date, time] = datetime.split("T");

  const data = {
    title: document.getElementById("event_name").value,
    venue: document.getElementById("venue").value,
    date,
    time
  };

  try {
    const res = await fetch(`${API_URL}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("Schedule added");
      fetchSchedules();
      e.target.reset();
    } else {
      const err = await res.json();
      alert(err.detail || "Failed to add schedule");
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  }
}

document.getElementById("deleteBtn").addEventListener("click", async () => {
  const selected = document.querySelectorAll(".select:checked");

  for (const checkbox of selected) {
    await fetch(`${API_URL}/schedule/${checkbox.dataset.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  fetchSchedules();
});
