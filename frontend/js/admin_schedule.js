import API from "./config.js";

const container = document.getElementById("scheduleContainer");
const popup = document.getElementById("popup");
const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const role = localStorage.getItem("role");
const token = localStorage.getItem("access_token");

if (role !== "faculty") {
  addBtn.style.display = "none";
}

document.addEventListener("DOMContentLoaded", loadSchedules);

addBtn.addEventListener("click", () => {
  popup.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
});

saveBtn.addEventListener("click", submitSchedule);

async function loadSchedules() {
  try {
    const res = await fetch(`${API}/schedules/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to load");

    const data = await res.json();
    const schedules = Array.isArray(data) ? data : data.data;

    container.innerHTML = "";

    if (!schedules || schedules.length === 0) {
      container.innerHTML = "<p>No schedules available</p>";
      return;
    }

    schedules.forEach(addCard);

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading schedules</p>";
  }
}

function addCard(schedule) {
  const card = document.createElement("div");
  card.className = "schedule-card";
  card.id = `schedule-${schedule.id}`;

  card.innerHTML = `
    <div>
      <h3>${schedule.title}</h3>
      <p>${schedule.venue}</p>
      <p>${schedule.date} | ${schedule.time}</p>
      ${schedule.link ? `<p><a href="${schedule.link}" target="_blank">Link</a></p>` : ""}
    </div>
  `;

  if (role === "faculty") {
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";

    delBtn.addEventListener("click", async () => {
      if (!confirm("Delete this schedule?")) return;

      const res = await fetch(`${API}/schedules/${schedule.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        card.remove();
      } else {
        alert("Delete failed");
      }
    });

    card.appendChild(delBtn);
  }

  container.appendChild(card);
}

async function submitSchedule() {
  const title = document.getElementById("title").value.trim();
  const venue = document.getElementById("venue").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const link = document.getElementById("link").value.trim();

  if (!title || !venue || !date || !time) {
    alert("Fill required fields");
    return;
  }

  try {
    const res = await fetch(`${API}/schedules/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, venue, date, time, link })
    });

    if (!res.ok) {
      alert("Only faculty allowed");
      return;
    }

    const newSchedule = await res.json();
    addCard(newSchedule);

    popup.classList.add("hidden");
    clearForm();

  } catch (err) {
    console.error(err);
    alert("Error saving schedule");
  }
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("venue").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
  document.getElementById("link").value = "";
}
