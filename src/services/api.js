const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const jsonHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

export async function loginRequest({ email, senha, studio_slug }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, senha, studio_slug })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Falha no login');
  return data;
}

export async function fetchClients(token, { status, search } = {}) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  const res = await fetch(`${API_URL}/clients?${params.toString()}`, {
    headers: jsonHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar clientes');
  return data.clients || [];
}

export async function updateClient(token, id, payload) {
  const res = await fetch(`${API_URL}/clients/${id}`, {
    method: 'PUT',
    headers: jsonHeaders(token),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar cliente');
  return data.client;
}

export async function fetchSessions(token) {
  const res = await fetch(`${API_URL}/sessions`, {
    headers: jsonHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar sessões');
  return data.sessions || [];
}

export async function fetchDashboard(token) {
  const res = await fetch(`${API_URL}/dashboard`, {
    headers: jsonHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar dashboard');
  return data;
}
