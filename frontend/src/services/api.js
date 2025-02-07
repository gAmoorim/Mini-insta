const API_URL = 'http://localhost:3000';

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login: email, senha: password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erro || 'Failed to login');
  }

  return response.json();
}

export async function fetchPosts() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token');
  }

  const response = await fetch(`${API_URL}/postagens`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json();
    throw new Error(error.erro || 'Failed to fetch posts');
  }

  const data = await response.json();
  console.log('Posts fetched:', data); // Debug log
  return data;
}