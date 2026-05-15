import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sw_token');
      localStorage.removeItem('sw_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export const authAPI = {
  login: (loginData) => api.post('/auth/login', { loginData }),
  register: (registerData) => api.post('/auth/register', { registerData }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (userId, password) =>
    api.post('/auth/reset-password', { userId, password }),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
};

export const cartAPI = {
  getCart: (userId) => api.get(`/carts/${userId}`),
  addToCart: (userId, productId, productCount = 1) =>
    api.post(`/carts/${userId}`, { productId, productCount }),
  removeFromCart: (userId, productId) =>
    api.delete(`/carts/${productId}/${userId}`),
};

export const wishlistAPI = {
  getWishlist: (userId) => api.get(`/wishlists/${userId}`),
  addToWishlist: (userId, productId) =>
    api.post(`/wishlists/${userId}`, { productId }),
  removeFromWishlist: (userId, productId) =>
    api.delete(`/wishlists/${productId}/${userId}`),
};

export const ordersAPI = {
  getUserOrders: (userId) => api.get(`/orders/${userId}`),
  placeOrder: (userId, body) => api.post(`/orders/${userId}`, body),
  confirmOrder: (userId, orderId) => api.put(`/orders/${userId}/${orderId}`),
};

export const paymentsAPI = {
  createCheckoutSession: (body) =>
    api.post('/payments/create-checkout-session', body),
  getCheckoutSession: (sessionId) =>
    api.get(`/payments/checkout-session/${sessionId}`),
};

export const usersAPI = {
  update: (id, userData) => api.put(`/users/${id}`, { userData }),
  updatePassword: (userId, password) =>
    api.put(`/users/${userId}/password`, { password }),
  updateAddress: (userId, address) =>
    api.put(`/users/${userId}/address`, { address }),
  deleteAddress: (userId, addressId) =>
    api.delete(`/users/${userId}/address/${addressId}`),
};

export default api;
