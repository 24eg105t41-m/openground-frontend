/**
 * Complete in-browser mock API — simulates the full backend.
 * Used when VITE_API_URL is not set or the backend is unreachable.
 * All data is stored in localStorage so it persists across page refreshes.
 */

import { DEMO_GROUNDS, getDemoGroundDetail } from '../data/demoData';

// ─── Helpers ────────────────────────────────────────────────────────────────

function store<T>(key: string, data: T) {
  localStorage.setItem(`og_mock_${key}`, JSON.stringify(data));
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`og_mock_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function now() {
  return new Date().toISOString();
}

// ─── Seed users ─────────────────────────────────────────────────────────────

const SEED_USERS = [
  { id: 'u-customer', fullName: 'Demo Customer', email: 'customer@openground.in', password: 'password123', phone: '9000000001', role: 'CUSTOMER' },
  { id: 'u-owner',    fullName: 'Ground Owner',   email: 'owner@centurion.com',    password: 'password123', phone: '9000000002', role: 'OWNER'    },
  { id: 'u-admin',    fullName: 'Admin User',      email: 'admin@openground.in',    password: 'admin123',    phone: '9000000003', role: 'ADMIN'    },
];

function getUsers() {
  const stored = load<typeof SEED_USERS>('users', []);
  // Merge seed users (don't duplicate)
  const emails = new Set(stored.map(u => u.email));
  const merged = [...stored];
  for (const u of SEED_USERS) {
    if (!emails.has(u.email)) merged.push(u);
  }
  return merged;
}

function saveUsers(users: typeof SEED_USERS) {
  store('users', users);
}

// ─── Mock response wrapper ───────────────────────────────────────────────────

function ok(data: unknown) {
  return { data, status: 200 };
}

function err(message: string, status = 400): never {
  const e: any = new Error(message);
  e.response = { status, data: { message } };
  throw e;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const mockAuth = {
  register(body: { fullName: string; email: string; password: string; phone?: string; role?: string }) {
    const users = getUsers();
    if (users.find(u => u.email === body.email)) {
      err('Email already registered. Please sign in instead.', 409);
    }
    const user = {
      id: 'u-' + uid(),
      fullName: body.fullName,
      email: body.email,
      password: body.password,
      phone: body.phone || '',
      role: (body.role || 'CUSTOMER') as string,
    };
    users.push(user);
    saveUsers(users);
    const { password: _, ...safe } = user;
    return ok({ token: 'mock-jwt-' + uid(), user: safe });
  },

  login(body: { email: string; password: string }) {
    const users = getUsers();
    const user = users.find(u => u.email === body.email && u.password === body.password);
    if (!user) err('Invalid email or password', 401);
    const { password: _, ...safe } = user!;
    return ok({ token: 'mock-jwt-' + uid(), user: safe });
  },

  me(token: string) {
    // Token isn't validated in mock — just return stored user
    const stored = localStorage.getItem('og_user');
    if (!stored) err('Unauthorized', 401);
    return ok(JSON.parse(stored!));
  },
};

// ─── Grounds ─────────────────────────────────────────────────────────────────

export const mockGrounds = {
  search(params: Record<string, string | number | undefined>) {
    let results = [...DEMO_GROUNDS];
    const city = params.city?.toString().toLowerCase();
    const search = params.search?.toString().toLowerCase();
    const pitchType = params.pitchType?.toString();
    const floodlights = params.floodlights?.toString();
    const maxRate = params.maxHourlyRate ? Number(params.maxHourlyRate) : undefined;

    if (city) results = results.filter(g =>
      g.city.toLowerCase().includes(city) || g.state.toLowerCase().includes(city)
    );
    if (search) results = results.filter(g => g.name.toLowerCase().includes(search));
    if (pitchType) results = results.filter(g => g.pitchType === pitchType);
    if (floodlights !== undefined) results = results.filter(g => String(g.floodlights) === floodlights);
    if (maxRate) results = results.filter(g => g.hourlyBaseRate <= maxRate);

    // Merge owner-created grounds
    const ownerGrounds = load<any[]>('owner_grounds', []);
    results = [...results, ...ownerGrounds];

    return ok(results);
  },

  getBySlug(slug: string) {
    try {
      return ok(getDemoGroundDetail(slug));
    } catch {
      err('Ground not found', 404);
    }
  },

  getPrice(groundId: string, slotId: string, date: string) {
    // Find slot across all demo grounds
    let base = 12000;
    for (const g of Object.values(DEMO_GROUNDS)) {
      const detail = (() => { try { return getDemoGroundDetail(g.slug); } catch { return null; } })();
      if (detail) {
        const slot = detail.slots.find(s => s.id === slotId);
        if (slot) { base = slot.weekdayPrice; break; }
      }
    }
    const tax = Math.round(base * 0.18);
    return ok({ groundId, date, slotId, isWeekend: false, basePrice: base, tax, totalPrice: base + tax, currency: 'INR' });
  },

  createGround(body: any) {
    if ((body.boundaryRadiusMeters || 0) < 55) {
      err('Minimum 55m boundary radius required for large outdoor grounds.');
    }
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + uid().slice(0, 6);
    const g = {
      id: 'g-' + uid(),
      name: body.name,
      slug,
      city: body.city,
      state: body.state,
      address: body.address,
      boundaryRadiusMeters: body.boundaryRadiusMeters,
      pitchType: body.pitchType || 'NATURAL_GRASS',
      floodlights: body.floodlights || false,
      seatingCapacity: body.seatingCapacity || 0,
      hourlyBaseRate: body.hourlyBaseRate,
      primaryImageUrl: (body.imageUrls || [])[0] || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
      keyFacilities: (body.facilities || []).slice(0, 3),
      averageRating: 0,
      reviewCount: 0,
    };
    const existing = load<any[]>('owner_grounds', []);
    store('owner_grounds', [...existing, g]);
    return ok(g);
  },
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const mockBookings = {
  create(body: { groundId: string; pricingSlotId: string; bookingDate: string; paymentMethod: string }) {
    const user = JSON.parse(localStorage.getItem('og_user') || '{}');
    // Check double booking
    const all = load<any[]>('bookings', []);
    const conflict = all.find(b =>
      b.groundId === body.groundId &&
      b.bookingDate === body.bookingDate &&
      b.slotId === body.pricingSlotId &&
      b.status !== 'CANCELLED'
    );
    if (conflict) err('This slot is already booked for the selected date. Please choose a different date or session.', 409);

    // Find ground + slot
    let groundName = 'Cricket Ground';
    let groundCity = '';
    let slotType = 'MORNING';
    let startTime = '7:00 AM';
    let endTime = '11:30 AM';
    let base = 12000;

    for (const g of DEMO_GROUNDS) {
      try {
        const detail = getDemoGroundDetail(g.slug);
        if (detail.id === body.groundId || detail.slug) {
          const slot = detail.slots.find(s => s.id === body.pricingSlotId);
          if (slot) {
            groundName = detail.name;
            groundCity = detail.city;
            slotType = slot.slotType;
            startTime = slot.startTime;
            endTime = slot.endTime;
            base = slot.weekdayPrice;
            break;
          }
        }
      } catch { /* */ }
    }

    const tax = Math.round(base * 0.18);
    const ref = 'OG-' + body.bookingDate.replace(/-/g, '').slice(2) + '-' + uid().slice(0, 6).toUpperCase();

    const booking = {
      id: 'b-' + uid(),
      bookingReference: ref,
      groundId: body.groundId,
      slotId: body.pricingSlotId,
      groundName,
      groundSlug: '',
      groundCity,
      slotType,
      bookingDate: body.bookingDate,
      startTime,
      endTime,
      totalAmount: base + tax,
      status: 'CONFIRMED',
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentMethod === 'PAY_AT_GROUND' ? 'PENDING' : 'PAID',
      userId: user.id,
      createdAt: now(),
    };

    store('bookings', [...all, booking]);
    return ok(booking);
  },

  myBookings() {
    const user = JSON.parse(localStorage.getItem('og_user') || '{}');
    const all = load<any[]>('bookings', []);
    return ok(all.filter(b => b.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  cancel(id: string) {
    const all = load<any[]>('bookings', []);
    const updated = all.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b);
    store('bookings', updated);
    return ok({ success: true });
  },
};

// ─── Owner ────────────────────────────────────────────────────────────────────

export const mockOwner = {
  myGrounds() {
    const user = JSON.parse(localStorage.getItem('og_user') || '{}');
    // For demo owner, return demo grounds
    if (user.email === 'owner@centurion.com') {
      return ok([DEMO_GROUNDS[0]]);
    }
    return ok(load<any[]>('owner_grounds', []));
  },
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const mockAdmin = {
  allGrounds: () => ok(DEMO_GROUNDS),
  approveGround: (id: string) => ok({ id, status: 'APPROVED' }),
  suspendGround: (id: string) => ok({ id, status: 'SUSPENDED' }),
  allUsers: () => ok(getUsers().map(({ password: _, ...u }) => u)),
  allBookings: () => ok(load<any[]>('bookings', [])),
};

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const mockReviews = {
  submit(body: { groundId: string; rating: number; comment: string }) {
    const user = JSON.parse(localStorage.getItem('og_user') || '{}');
    const review = { id: 'r-' + uid(), ...body, reviewerName: user.fullName, createdAt: now() };
    const all = load<any[]>('reviews', []);
    store('reviews', [...all, review]);
    return ok(review);
  },
};
