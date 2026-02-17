import API from "./config.js";

const popup = document.getElementById("popup");
const addBtn = document.getElementById("addBtn");
const scheduleContainer = document.getElementById("scheduleContainer");

addBtn.addEventListener("click", () => {
  popup.classList.remove("hidden");
});

window.closePopup = function () {
  popup.classList.add("hidden");
};

window.submitSchedule = async function () {
  const title = document.getElementById("title").value;
  const venue = document.getElementById("venue").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const link = document.getElementById("link").value;

  if (!title || !venue || !date || !time) {
    alert("Fill all required fields");
    return;
  }

  await fetch(`${API}/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      event_name: title,
      venue: venue,
      datetime: `${date} ${time}`,
      link: link
    })
  });

  popup.classList.add("hidden");
  loadSchedule();
};

async function loadSchedule() {
  const res = await fetch(`${API}/schedule`);
  const data = await res.json();

  scheduleContainer.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "schedule-card";

    card.innerHTML = `
      <div class="schedule-left">
        <h3>${item.event_name}</h3>
        <p>Venue: ${item.venue}</p>
        <p>Date & Time: ${item.datetime}</p>
        ${item.link ? `<p><a href="${item.link}" target="_blank">View Link</a></p>` : ""}
      </div>
      <button onclick="deleteSchedule(${item.id})">Delete</button>
    `;

    scheduleContainer.appendChild(card);
  });
}

window.deleteSchedule = async function (id) {
  await fetch(`${API}/schedule/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  loadSchedule();
};

loadSchedule();
