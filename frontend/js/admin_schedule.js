import API from "./config.js";

const container = document.getElementById("scheduleContainer");
const popup = document.getElementById("popup");
const addBtn = document.getElementById("addBtn");
const dateInput = document.getElementById("date");
const submitBtn = document.getElementById("submitBtn");

const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

if (role === "faculty") {
  addBtn.style.display = "block";
} else {
  addBtn.style.display = "none";
}

addBtn.addEventListener("click", () => {
  popup.classList.remove("hidden");
});

function closePopup() {
  popup.classList.add("hidden");
}

const todayISO = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", todayISO);

async function loadSchedules() {
  try {
    const res = await fetch(`${API}/schedules/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      container.innerHTML = "<p>Failed to load schedules</p>";
      return;
    }

    const schedules = await res.json();
    container.innerHTML = "";

    schedules.forEach((schedule) => {
      const card = createCard(schedule);
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "<p>Error loading schedules</p>";
  }
}

submitBtn.addEventListener("click", submitSchedule);

async function submitSchedule() {
  const title = document.getElementById("title").value.trim();
  const venue = document.getElementById("venue").value.trim();
  const date = dateInput.value;
  const time = document.getElementById("time").value;
  const link = document.getElementById("link").value.trim();

  if (!title || !venue || !date || !time) {
    alert("Fill all required fields");
    return;
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert("Past dates not allowed");
    return;
  }

  try {
    const res = await fetch(`${API}/schedules/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, venue, date, time, link }),
    });

    if (!res.ok) {
      alert("Only faculty can add schedules");
      return;
    }

    const schedule = await res.json();
    const card = createCard(schedule);
    container.appendChild(card);

    closePopup();
    clearForm();
  } catch (error) {
    alert("Error adding schedule");
  }
}

function createCard(schedule) {
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
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Delete schedule?")) return;

      const res = await fetch(`${API}/schedules/${schedule.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        card.remove();
      } else {
        alert("Failed to delete");
      }
    });

    card.appendChild(deleteBtn);
  }

  return card;
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("venue").value = "";
  dateInput.value = "";
  document.getElementById("time").value = "";
  document.getElementById("link").value = "";
}

loadSchedules();
