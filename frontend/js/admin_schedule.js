const API = "https://artc-backend.onrender.com";
const container = document.getElementById("scheduleContainer");
const deleteBtn = document.getElementById("deleteBtn");

document.getElementById("scheduleForm").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    event_name: event_name.value,
    venue: venue.value,
    datetime: datetime.value
  };

  await fetch(`${API}/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  });

  e.target.reset();
  loadSchedule();
});

async function loadSchedule() {
  const res = await fetch(`${API}/schedule`);
  const data = await res.json();

  container.innerHTML = "";

  data.forEach(item => {
    container.innerHTML += `
      <div class="schedule-card">
        <h3>${item.event_name}</h3>
        <p><strong>Date:</strong> ${new Date(item.datetime).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(item.datetime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</p>
        <p><strong>Venue:</strong> ${item.venue}</p>
        <input type="checkbox" class="select" data-id="${item.id}">
      </div>
    `;
  });

  toggleDeleteBtn();
}

function toggleDeleteBtn() {
  const checkboxes = document.querySelectorAll(".select");
  checkboxes.forEach(cb => cb.addEventListener("change", () => {
    deleteBtn.style.display =
      document.querySelectorAll(".select:checked").length > 0
        ? "inline-block"
        : "none";
  }));
}

deleteBtn.addEventListener("click", async () => {
  const selected = document.querySelectorAll(".select:checked");

  for (let cb of selected) {
    await fetch(`${API}/schedule/${cb.dataset.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  }

  deleteBtn.style.display = "none";
  loadSchedule();
});

loadSchedule();
