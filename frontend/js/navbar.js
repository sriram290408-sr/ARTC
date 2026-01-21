const arrow = document.querySelector(".dropdown-arrow");
  const userIcon = document.querySelector(".user-icon");

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    userIcon.classList.toggle("open");
  });