const API = "https://artc-backend.onrender.com";
const container = document.getElementById("scheduleContainer");
const popup = document.getElementById("popup");
const addBtn = document.getElementById("addBtn");
const dateInput = document.getElementById("date");

const role = localStorage.getItem("role");

addBtn.style.display = role === "faculty" ? "block" : "none";
addBtn.onclick = () => popup.classList.remove("hidden");

function closePopup() {
  popup.classList.add("hidden");
}

/* -----------------------------
   BLOCK PAST DATES IN PICKER
----------------------------- */

const todayISO = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", todayISO);

/* -----------------------------
   LOAD SCHEDULES
----------------------------- */

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
      <div class="schedule-card" id="schedule-${s.id}">
        <div>
          <h3>${s.title}</h3>
          <p>${s.venue}</p>
          <p>${s.date} | ${s.time}</p>
          ${
            s.link
              ? `<p><a href="${s.link}" target="_blank">Link</a></p>`
              : ""
          }
        </div>
        ${
          role === "faculty"
            ? `<button onclick="deleteSchedule(${s.id})">Delete</button>`
            : ""
        }
      </div>
    `;
  });
}

/* -----------------------------
   SUBMIT SCHEDULE
----------------------------- */

async function submitSchedule() {
  const title = document.getElementById("title").value.trim();
  const venue = document.getElementById("venue").value.trim();
  const date = dateInput.value;
  const time = document.getElementById("time").value;
  const link = document.getElementById("link").value.trim();

  if (!title || !venue || !date || !time) {
    alert("Fill all fields except link (optional)");
    return;
  }

  // 🔥 reject past dates
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert("Past dates are not allowed.");
    return;
  }

  const res = await fetch(`${API}/schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify({ title, venue, date, time, link })
  });

  if (!res.ok) {
    alert("Only faculty can add");
    return;
  }

  const schedule = await res.json();
  addCard(schedule);
  closePopup();
  clearForm();
}

/* -----------------------------
   ADD CARD
----------------------------- */

function addCard(schedule) {
  container.innerHTML += `
    <div class="schedule-card" id="schedule-${schedule.id}">
      <div>
        <h3>${schedule.title}</h3>
        <p>${schedule.venue}</p>
        <p>${schedule.date} | ${schedule.time}</p>
        ${
          schedule.link
            ? `<p><a href="${schedule.link}" target="_blank">Link</a></p>`
            : ""
        }
      </div>
      ${
        role === "faculty"
          ? `<button onclick="deleteSchedule(${schedule.id})">Delete</button>`
          : ""
      }
    </div>
  `;
}

/* -----------------------------
   DELETE
----------------------------- */

async function deleteSchedule(id) {
  await fetch(`${API}/schedules/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  const card = document.getElementById(`schedule-${id}`);
  if (card) card.remove();
}

/* -----------------------------
   CLEAR FORM
----------------------------- */

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("venue").value = "";
  dateInput.value = "";
  document.getElementById("time").value = "";
  document.getElementById("link").value = "";
}

loadSchedules();
