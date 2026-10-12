// API and type definitions for OpenGround frontend

export type Role = 'CUSTOMER' | 'OWNER' | 'ADMIN';
export type PitchType = 'NATURAL_GRASS' | 'ARTIFICIAL_TURF';
export type SlotType = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'FULL_DAY';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentMethod = 'PAY_AT_GROUND' | 'ONLINE_SANDBOX';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GroundImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  caption?: string;
}

export interface PricingSlot {
  id: string;
  slotType: SlotType;
  startTime: string;
  endTime: string;
  weekdayPrice: number;
  weekendPrice: number;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface GroundSummary {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string;
  boundaryRadiusMeters: number;
  pitchType: PitchType;
  floodlights: boolean;
  seatingCapacity?: number;
  hourlyBaseRate: number;
  primaryImageUrl?: string;
  keyFacilities: string[];
  averageRating: number;
  reviewCount: number;
}

export interface GroundDetail extends GroundSummary {
  description?: string;
  pavilionDetails?: string;
  images: GroundImage[];
  facilities: string[];
  slots: PricingSlot[];
  reviews: Review[];
  status: string;
  createdAt: string;
}

export interface BookingPriceResponse {
  groundId: string;
  date: string;
  slotType: SlotType;
  slotId: string;
  isWeekend: boolean;
  basePrice: number;
  tax: number;
  totalPrice: number;
  currency: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  groundName: string;
  groundSlug: string;
  groundCity: string;
  slotType: SlotType;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  createdAt: string;
}

export interface CreateBookingRequest {
  groundId: string;
  pricingSlotId: string;
  bookingDate: string;
  paymentMethod: PaymentMethod;
}
