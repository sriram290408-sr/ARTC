import API from "./config";

const container = document.getElementById("scheduleContainer");
const popup = document.getElementById("popup");
const addBtn = document.getElementById("addBtn");

const role = localStorage.getItem("role"); 
addBtn.style.display = role === "faculty" ? "block" : "none";
addBtn.onclick = () => popup.classList.remove("hidden");

function closePopup() { popup.classList.add("hidden"); }

async function loadSchedules() {
  const res = await fetch(`${API}/schedules`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
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
          ${s.link ? `<p><a href="${s.link}" target="_blank">Link</a></p>` : ""}
        </div>
        ${role === "faculty" ? `<button onclick="deleteSchedule(${s.id})">Delete</button>` : ""}
      </div>
    `;
  });
}

async function submitSchedule() {
  const title = document.getElementById("title").value.trim();
  const venue = document.getElementById("venue").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const link = document.getElementById("link").value.trim(); 

  if (!title || !venue || !date || !time) {
    alert("Fill all fields except link (optional)");
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

  if (!res.ok) { alert("Only faculty can add"); return; }

  const schedule = await res.json();
  addCard(schedule);
  closePopup();
  clearForm();
}

function addCard(schedule) {
  container.innerHTML += `
    <div class="schedule-card" id="schedule-${schedule.id}">
      <div>
        <h3>${schedule.title}</h3>
        <p>${schedule.venue}</p>
        <p>${schedule.date} | ${schedule.time}</p>
        ${schedule.link ? `<p><a href="${schedule.link}" target="_blank">Link</a></p>` : ""}
      </div>
      ${role === "faculty" ? `<button onclick="deleteSchedule(${schedule.id})">Delete</button>` : ""}
    </div>
  `;
}

async function deleteSchedule(id) {
  await fetch(`${API}/schedules/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
  });
  const card = document.getElementById(`schedule-${id}`);
  if (card) card.remove();
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("venue").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
  document.getElementById("link").value = ""; 
}

loadSchedules();
