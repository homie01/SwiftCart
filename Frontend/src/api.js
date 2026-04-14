const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}

export const api = {
  baseUrl: API_BASE_URL,
  getProducts: () => request('/products'),
  getProductById: (id) => request(`/products/${id}`),
  getCategories: () => request('/categories'),
  getUserById: (userId) => request(`/users/${userId}`),
  updateUser: (userId, userData) =>
    request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ userData }),
    }),
  addAddress: (userId, address) =>
    request(`/users/addresses/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ address }),
    }),
  login: (loginData) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ loginData }),
    }),
  register: (registerData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ registerData }),
    }),
  getUserCart: (userId) => request(`/carts/${userId}`),
  addToCart: (userId, productId, productCount = 1) =>
    request(`/carts/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ productId, productCount }),
    }),
  removeFromCart: (productId, userId) =>
    request(`/carts/${productId}/${userId}`, {
      method: 'DELETE',
    }),
  getOrders: (userId) => request(`/orders/${userId}`),
  placeOrder: (userId, payload) =>
    request(`/orders/${userId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  confirmOrder: (userId, orderId) =>
    request(`/orders/${userId}/${orderId}`, {
      method: 'PUT',
    }),
};
