const BASE_URL = "https://artc-backend.onrender.com";

async function addCommitteeMember(name, designation) {
  const res = await fetch(`${BASE_URL}/committee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify({ name, designation })
  });

  return res.json();
}

async function viewCommitteeMembers() {
  const res = await fetch(`${BASE_URL}/committee`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  return res.json();
}

async function deleteCommitteeMember(id) {
  const res = await fetch(`${BASE_URL}/committee/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  return res.json();
}
