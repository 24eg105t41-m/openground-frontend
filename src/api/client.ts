import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('og_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally → clear session
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('og_token');
      localStorage.removeItem('og_user');
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Auth ────────────────────────────────────────────────
export const authApi = {
  register: (data: { fullName: string; email: string; password: string; phone?: string; role?: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
};

// ── Grounds ─────────────────────────────────────────────
export const groundsApi = {
  search: (params: Record<string, string | number | undefined>) =>
    api.get('/api/grounds', { params }),
  getBySlug: (slug: string) =>
    api.get(`/api/grounds/${slug}`),
  getPrice: (groundId: string, slotId: string, date: string) =>
    api.get(`/api/grounds/${groundId}/price`, { params: { slotId, date } }),
};

// ── Bookings ─────────────────────────────────────────────
export const bookingsApi = {
  create: (data: { groundId: string; pricingSlotId: string; bookingDate: string; paymentMethod: string }) =>
    api.post('/api/bookings', data),
  myBookings: () =>
    api.get('/api/bookings/my'),
  cancel: (id: string) =>
    api.post(`/api/bookings/${id}/cancel`),
};

// ── Reviews ──────────────────────────────────────────────
export const reviewsApi = {
  submit: (data: { groundId: string; rating: number; comment: string }) =>
    api.post('/api/reviews', data),
};

// ── Owner ────────────────────────────────────────────────
export const ownerApi = {
  myGrounds: () => api.get('/api/owner/grounds'),
  createGround: (data: object) => api.post('/api/owner/grounds', data),
};

// ── Admin ────────────────────────────────────────────────
export const adminApi = {
  allGrounds: () => api.get('/api/admin/grounds'),
  approveGround: (id: string) => api.post(`/api/admin/grounds/${id}/approve`),
  suspendGround: (id: string) => api.post(`/api/admin/grounds/${id}/suspend`),
  allUsers: () => api.get('/api/admin/users'),
  allBookings: () => api.get('/api/admin/bookings'),
};
