const API = "https://artc-backend.onrender.com";
const container = document.getElementById("scheduleContainer");
const deleteBtn = document.getElementById("deleteBtn");
const token = localStorage.getItem("access_token");

document.getElementById("scheduleForm").addEventListener("submit", async e => {
  e.preventDefault();
  const data = {
    event_name: document.getElementById("event_name").value,
    venue: document.getElementById("venue").value,
    datetime: document.getElementById("datetime").value
  };
  await fetch(`${API}/schedule/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  e.target.reset();
  loadSchedule();
});

async function loadSchedule() {
  const res = await fetch(`${API}/schedule/`);
  const data = await res.json();
  container.innerHTML = "";
  deleteBtn.style.display = "none";

  data.forEach(item => {
    container.innerHTML += `
      <div class="schedule-card">
        <div class="schedule-left">
          <h3>${item.event_name}</h3>
          <p><strong>Date:</strong> ${new Date(item.datetime).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(item.datetime).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit'})}</p>
          <p><strong>Venue:</strong> ${item.venue}</p>
        </div>
        <div class="schedule-right">
          <input type="checkbox" class="selectSchedule" data-id="${item.id}">
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".selectSchedule").forEach(cb => {
    cb.addEventListener("change", () => {
      deleteBtn.style.display = document.querySelectorAll(".selectSchedule:checked").length ? "inline-block" : "none";
    });
  });
}

deleteBtn.addEventListener("click", async () => {
  const selected = document.querySelectorAll(".selectSchedule:checked");
  for (let cb of selected) {
    await fetch(`${API}/schedule/${cb.dataset.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  loadSchedule();
});

loadSchedule();
