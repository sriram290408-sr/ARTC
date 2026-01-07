const API = "https://artc-backend.onrender.com";
const container = document.getElementById("scheduleContainer");
const popup = document.getElementById("popup");
const addBtn = document.getElementById("addBtn");

const role = localStorage.getItem("role");

addBtn.style.display = role === "faculty" ? "block" : "none";

addBtn.onclick = () => popup.classList.remove("hidden");

function closePopup() {
  popup.classList.add("hidden");
}

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
        <div>
          <h3>${s.title}</h3>
          <p>${s.venue}</p>
          <p>${s.date} | ${s.time}</p>
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

async function submitSchedule() {
  const title = document.getElementById("title").value.trim();
  const venue = document.getElementById("venue").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!title || !venue || !date || !time) {
    alert("Fill all fields");
    return;
  }

  const res = await fetch(`${API}/schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify({ title, venue, date, time })
  });

  if (!res.ok) {
    alert("Only faculty can add schedules");
    return;
  }

  closePopup();
  loadSchedules();
}

async function deleteSchedule(id) {
  await fetch(`${API}/schedules/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  loadSchedules();
}

loadSchedules();
