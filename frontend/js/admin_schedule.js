import API from "./config.js";

const popup = document.getElementById("popup");
const scheduleContainer = document.getElementById("scheduleContainer");
const addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", () => {
  popup.classList.remove("hidden");
});

window.closePopup = function () {
  popup.classList.add("hidden");
};

window.submitSchedule = async function () {
  const title = document.getElementById("title").value.trim();
  const venue = document.getElementById("venue").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const link = document.getElementById("link").value.trim();

  if (!title || !venue || !date || !time) {
    alert("All required fields must be filled.");
    return;
  }

  const data = {
    event_name: title,
    venue: venue,
    datetime: `${date} ${time}`,
    link: link
  };

  await fetch(`${API}/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  });

  popup.classList.add("hidden");
  loadSchedule();
};

async function loadSchedule() {
  const res = await fetch(`${API}/schedule`);
  const data = await res.json();

  scheduleContainer.innerHTML = "";

  data.forEach(s => {
    const card = document.createElement("div");
    card.classList.add("schedule-card");

    card.innerHTML = `
      <div class="schedule-left">
        <h3>${s.event_name}</h3>
        <p><strong>Venue:</strong> ${s.venue}</p>
        <p><strong>Date & Time:</strong> ${s.datetime}</p>
        ${s.link ? `<p><a href="${s.link}" target="_blank">View Link</a></p>` : ""}
      </div>
      <button class="delete-btn">Delete</button>
    `;

    card.querySelector(".delete-btn").addEventListener("click", () => {
      deleteSchedule(s.id);
    });

    scheduleContainer.appendChild(card);
  });
}

async function deleteSchedule(id) {
  await fetch(`${API}/schedule/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  loadSchedule();
}

loadSchedule();
