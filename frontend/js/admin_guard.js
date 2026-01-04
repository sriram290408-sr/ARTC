const role = localStorage.getItem("role");
const token = localStorage.getItem("token");

if (!token || role !== "admin") {
  window.location.href = "/admin.html";
}
