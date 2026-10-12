/**
 * Smart API client.
 * - Tries real backend first (VITE_API_URL or http://localhost:8080)
 * - Falls back transparently to the in-browser mock API on any network/timeout error
 * - No "Demo Mode" banners — the mock is fully functional
 */

import axios from 'axios';
import * as mock from './mockApi';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Real backend client
const http = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('og_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('og_token');
      localStorage.removeItem('og_user');
    }
    return Promise.reject(err);
  }
);

// Helper: returns true when the error is a network/timeout error (backend offline)
function isOffline(err: any): boolean {
  return !err.response; // no HTTP response = network error / timeout / CORS
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  async register(data: { fullName: string; email: string; password: string; phone?: string; role?: string }) {
    try {
      return await http.post('/api/auth/register', data);
    } catch (err: any) {
      if (isOffline(err)) return mock.mockAuth.register(data) as any;
      throw err;
    }
  },
  async login(data: { email: string; password: string }) {
    try {
      return await http.post('/api/auth/login', data);
    } catch (err: any) {
      if (isOffline(err)) return mock.mockAuth.login(data) as any;
      throw err;
    }
  },
  async me() {
    try {
      return await http.get('/api/auth/me');
    } catch (err: any) {
      if (isOffline(err)) return mock.mockAuth.me(localStorage.getItem('og_token') || '') as any;
      throw err;
    }
  },
};

// ── Grounds ───────────────────────────────────────────────────────────────────
export const groundsApi = {
  async search(params: Record<string, string | number | undefined>) {
    try {
      return await http.get('/api/grounds', { params });
    } catch (err: any) {
      if (isOffline(err)) return mock.mockGrounds.search(params) as any;
      throw err;
    }
  },
  async getBySlug(slug: string) {
    try {
      return await http.get(`/api/grounds/${slug}`);
    } catch (err: any) {
      if (isOffline(err)) return mock.mockGrounds.getBySlug(slug) as any;
      throw err;
    }
  },
  async getPrice(groundId: string, slotId: string, date: string) {
    try {
      return await http.get(`/api/grounds/${groundId}/price`, { params: { slotId, date } });
    } catch (err: any) {
      if (isOffline(err)) return mock.mockGrounds.getPrice(groundId, slotId, date) as any;
      throw err;
    }
  },
};

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingsApi = {
  async create(data: { groundId: string; pricingSlotId: string; bookingDate: string; paymentMethod: string }) {
    try {
      return await http.post('/api/bookings', data);
    } catch (err: any) {
      if (isOffline(err)) return mock.mockBookings.create(data) as any;
      throw err;
    }
  },
  async myBookings() {
    try {
      return await http.get('/api/bookings/my');
    } catch (err: any) {
      if (isOffline(err)) return mock.mockBookings.myBookings() as any;
      throw err;
    }
  },
  async cancel(id: string) {
    try {
      return await http.post(`/api/bookings/${id}/cancel`);
    } catch (err: any) {
      if (isOffline(err)) return mock.mockBookings.cancel(id) as any;
      throw err;
    }
  },
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewsApi = {
  async submit(data: { groundId: string; rating: number; comment: string }) {
    try {
      return await http.post('/api/reviews', data);
    } catch (err: any) {
      if (isOffline(err)) return mock.mockReviews.submit(data) as any;
      throw err;
    }
  },
};

// ── Owner ─────────────────────────────────────────────────────────────────────
export const ownerApi = {
  async myGrounds() {
    try {
      return await http.get('/api/owner/grounds');
    } catch (err: any) {
      if (isOffline(err)) return mock.mockOwner.myGrounds() as any;
      throw err;
    }
  },
  async createGround(data: object) {
    try {
      return await http.post('/api/owner/grounds', data);
    } catch (err: any) {
      if (isOffline(err)) return mock.mockGrounds.createGround(data) as any;
      throw err;
    }
  },
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  async allGrounds() {
    try { return await http.get('/api/admin/grounds'); }
    catch (err: any) { if (isOffline(err)) return mock.mockAdmin.allGrounds() as any; throw err; }
  },
  async approveGround(id: string) {
    try { return await http.post(`/api/admin/grounds/${id}/approve`); }
    catch (err: any) { if (isOffline(err)) return mock.mockAdmin.approveGround(id) as any; throw err; }
  },
  async suspendGround(id: string) {
    try { return await http.post(`/api/admin/grounds/${id}/suspend`); }
    catch (err: any) { if (isOffline(err)) return mock.mockAdmin.suspendGround(id) as any; throw err; }
  },
  async allUsers() {
    try { return await http.get('/api/admin/users'); }
    catch (err: any) { if (isOffline(err)) return mock.mockAdmin.allUsers() as any; throw err; }
  },
  async allBookings() {
    try { return await http.get('/api/admin/bookings'); }
    catch (err: any) { if (isOffline(err)) return mock.mockAdmin.allBookings() as any; throw err; }
  },
};

export default http;
