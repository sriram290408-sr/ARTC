function showReports() {
  container.innerHTML = "";

  let list = [...reports];
  if (sortSelect.value === "oldest") list.reverse();

  list.forEach(r => {
    container.innerHTML += `
      <div class="report-card status-${r.status.toLowerCase()}"
           onclick="openReport(${r.id})">

        <div>
          <h3>${r.title}</h3>
          <p>${r.description}</p>
          <small>
            <b>Location:</b> ${r.incident_location}<br>
            <b>Reported By:</b> ${r.name} (${r.class_section})
          </small>
        </div>

        <div>
          <b>${r.problem_type}</b><br>
          ${formatDate(r.incident_date)}<br>
          <span class="${r.status.toLowerCase()}">${r.status}</span>
        </div>
      </div>
    `;
  });
}

function openReport(id) {
  window.location.href = `admin_report.html?id=${id}`;
}
