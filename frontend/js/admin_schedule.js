import API from "./config.js";

function openPopup() {
  document.querySelector(".popup").style.display = "block";
  document.querySelector(".overlay").style.display = "block";
}

function closePopup() {
  document.querySelector(".popup").style.display = "none";
  document.querySelector(".overlay").style.display = "none";
}

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

  closePopup();
  loadSchedule();
});

async function loadSchedule() {
  const res = await fetch(`${API}/schedule`);
  const data = await res.json();

  const list = document.getElementById("scheduleList");
  list.innerHTML = "";

  data.forEach(s => {
    list.innerHTML += `
      <li>
        ${s.event_name} - ${s.venue} - ${s.datetime}
        <button onclick="deleteSchedule(${s.id})">X</button>
      </li>`;
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
