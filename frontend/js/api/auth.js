const API_BASE = 'https://glorious-space-system-jj56vp4qpjj6fpw5x-3000.app.github.dev';

export async function registerUser(data) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  // Lưu token vào localStorage nếu có
  if (result.token) {
    localStorage.setItem('token', result.token);
  }

  return result;
}

export function logoutUser() {
  // Gọi API nếu cần, ở đây chỉ xóa token localStorage
  localStorage.removeItem('token');
}
