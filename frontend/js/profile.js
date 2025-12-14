const API = "http://127.0.0.1:8000";

const nameInput = document.getElementById("name");
const classInput = document.getElementById("class_section");
const rollInput = document.getElementById("roll_no");
const schoolInput = document.getElementById("school");

const saveBtn = document.getElementById("saveProfile");

const profileName = document.getElementById("profileName");
const profileInitials = document.getElementById("profileInitials");

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  loadReportStats();
});

saveBtn.addEventListener("click", saveProfile);

// LOAD PROFILE
async function loadProfile() {
  try {
    const res = await fetch(`${API}/user/profile`);
    if (!res.ok) return;

    const data = await res.json();

    nameInput.value = data.name;
    classInput.value = data.class_section;
    rollInput.value = data.roll_no;
    schoolInput.value = data.school;

    profileName.textContent = data.name;
    profileInitials.textContent = getInitials(data.name);
  } catch (err) {
    console.error("Profile load failed", err);
  }
}

// SAVE PROFILE
async function saveProfile() {
  const payload = {
    name: nameInput.value.trim(),
    class_section: classInput.value.trim(),
    roll_no: rollInput.value,
    school: schoolInput.value.trim()
  };

  try {
    const res = await fetch(`${API}/user/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error();

    alert("Profile updated successfully");
    loadProfile();
  } catch {
    alert("Failed to update profile");
  }
}

// REPORT STATS
async function loadReportStats() {
  try {
    const res = await fetch(`${API}/reports/history`);
    const reports = await res.json();

    document.getElementById("totalReports").textContent = reports.length;
    document.getElementById("pendingReports").textContent =
      reports.filter(r => r.status === "Pending").length;
    document.getElementById("resolvedReports").textContent =
      reports.filter(r => r.status === "Completed").length;
  } catch (err) {
    console.error("Report stats error", err);
  }
}

function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase();
}
