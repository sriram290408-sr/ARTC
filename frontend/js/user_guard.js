const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "student") {
  window.location.href = "/index.html";
}
