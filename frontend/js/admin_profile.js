import API from "./config";

const profileName = document.getElementById("profileName");
const profileInitials = document.getElementById("profileInitials");

const nameInput = document.getElementById("name");
const classSectionInput = document.getElementById("class_section");
const rollNoInput = document.getElementById("roll_no");
const schoolInput = document.getElementById("school");

const saveBtn = document.getElementById("saveProfile");

function getInitials(name) {
  if (!name) return "NA";

  return name
    .trim()
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function updateProfileUI() {
  const name = nameInput.value.trim();
  const classSection = classSectionInput.value.trim();
  const school = schoolInput.value.trim();

  if (!name || !classSection || !school) {
    alert("Please complete all required fields");
    return;
  }

  profileName.textContent = name;
  profileInitials.textContent = getInitials(name);

  saveBtn.textContent = "Saved ✔";
  saveBtn.disabled = true;

  setTimeout(() => {
    saveBtn.textContent = "Save Profile";
    saveBtn.disabled = false;
  }, 1500);

  localStorage.setItem(
    "artc_profile_ui",
    JSON.stringify({
      name,
      class_section: classSection,
      roll_no: rollNoInput.value,
      school
    })
  );
}

function loadProfileUI() {
  const saved = localStorage.getItem("artc_profile_ui");
  if (!saved) return;

  const data = JSON.parse(saved);

  nameInput.value = data.name;
  classSectionInput.value = data.class_section;
  rollNoInput.value = data.roll_no;
  schoolInput.value = data.school;

  profileName.textContent = data.name;
  profileInitials.textContent = getInitials(data.name);
}

saveBtn.addEventListener("click", updateProfileUI);

document.addEventListener("DOMContentLoaded", loadProfileUI);

document.addEventListener("DOMContentLoaded", () => {
  loadReportCounts();
});

async function loadReportCounts() {
  try {
    const response = await fetch(`${API}`,
      { credentials: "include" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch report counts");
    }

    const data = await response.json();

    document.getElementById("totalReports").textContent =
      data.total ?? 0;

    document.getElementById("pendingReports").textContent =
      data.pending ?? 0;

    document.getElementById("resolvedReports").textContent =
      data.resolved ?? 0;

  } catch (error) {
    console.error(error);

    document.getElementById("totalReports").textContent = 0;
    document.getElementById("pendingReports").textContent = 0;
    document.getElementById("resolvedReports").textContent = 0;
  }
}