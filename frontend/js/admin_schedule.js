const API = "https://artc-backend.onrender.com";
const container = document.getElementById("scheduleContainer");
const popup = document.getElementById("popup");
const addBtn = document.getElementById("addBtn");

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
        <h3>${s.title}</h3>
        <p>${s.date} | ${s.time}</p>
        <button onclick="deleteSchedule(${s.id})">Delete</button>
      </div>
    `;
  });
}

async function submitSchedule() {
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!title || !date || !time) {
    alert("Fill all fields");
    return;
  }

  const res = await fetch(`${API}/schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify({ title, date, time })
  });

  if (!res.ok) {
    alert("Only admin can add");
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
