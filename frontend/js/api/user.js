const API_BASE = 'https://glorious-space-system-jj56vp4qpjj6fpw5x-3000.app.github.dev';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export async function getUser(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'GET',
    headers: getAuthHeader()
  });
  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PATCH',
    headers: getAuthHeader(),
    body: JSON.stringify(data)
  });
  return res.json();
}
