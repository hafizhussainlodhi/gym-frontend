const BASE = 'https://gym-backend-iota-woad.vercel.app/api';

function getToken() {
  return localStorage.getItem('gym_token');
}

async function request(path, { method = 'GET', body, params } = {}) {
  let url = `${BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== '')));
    const str = qs.toString();
    if (str) url += `?${str}`;
  }

  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with ${res.status}`);
  }
  return data;
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  dashboard: (branch_id) => request('/dashboard', { params: { branch_id } }),
  branches: {
    list: () => request('/branches'),
    create: (body) => request('/branches', { method: 'POST', body })
  },
  plans: {
    list: () => request('/membership-plans'),
    create: (body) => request('/membership-plans', { method: 'POST', body })
  },
  members: {
    list: (branch_id) => request('/members', { params: { branch_id } }),
    create: (body) => request('/members', { method: 'POST', body }),
    update: (id, body) => request(`/members/${id}`, { method: 'PUT', body }),
    remove: (id) => request(`/members/${id}`, { method: 'DELETE' })
  },
  attendance: {
    list: (branch_id) => request('/attendance', { params: { branch_id } }),
    checkIn: (body) => request('/attendance/check-in', { method: 'POST', body }),
    checkOut: (id) => request(`/attendance/${id}/check-out`, { method: 'POST' })
  },
  payments: {
    list: (branch_id) => request('/payments', { params: { branch_id } }),
    create: (body) => request('/payments', { method: 'POST', body })
  }
};

export { getToken };
