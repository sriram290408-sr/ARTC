const API_URL = "https://artc-backend.onrender.com";
const token = localStorage.getItem("access_token");

document.addEventListener("DOMContentLoaded", () => {
  fetchSchedules();
  document.getElementById("scheduleForm")?.addEventListener("submit", addSchedule);
});

async function fetchSchedules() {
  const container = document.getElementById("scheduleContainer");
  container.innerHTML = "";

  try {
    const res = await fetch(`${API_URL}/schedule/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      container.innerHTML = "<p>Admin access required</p>";
      return;
    }

    const schedules = await res.json();

    schedules.forEach(s => {
      const card = document.createElement("div");
      card.className = "schedule-card";

      card.innerHTML = `
        <input type="checkbox" class="select" data-id="${s.id}">
        <h3>${s.title}</h3>
        <p>Date: ${new Date(s.date).toLocaleDateString()}</p>
        <p>Time: ${s.time || "N/A"}</p>
        <p>Venue: ${s.venue || "N/A"}</p>
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
    const res = await fetch(`${API_URL}/schedule/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message);
      fetchSchedules();
      e.target.reset();
    } else {
      alert(result.detail || "Failed to add schedule");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to add schedule");
  }
}

document.getElementById("deleteBtn")?.addEventListener("click", async () => {
  const selected = document.querySelectorAll(".select:checked");

  for (const checkbox of selected) {
    await fetch(`${API_URL}/schedule/${checkbox.dataset.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  fetchSchedules();
});
