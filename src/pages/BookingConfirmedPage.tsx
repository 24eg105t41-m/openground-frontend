import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, MapPin, Calendar, Clock, Share2 } from 'lucide-react';
import { Booking } from '../types';
import { formatCurrency, slotTypeLabel, formatDate } from '../utils/helpers';

export default function BookingConfirmedPage() {
  const { state } = useLocation() as { state: { booking: Booking } | null };
  const navigate = useNavigate();

  if (!state?.booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No booking found.</p>
          <Link to="/grounds" className="btn-primary">Browse Grounds</Link>
        </div>
      </div>
    );
  }

  const b = state.booking;

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-forest-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-6">Your outdoor cricket ground is booked. See you at the crease!</p>

          <div className="bg-forest-50 rounded-2xl p-5 text-left space-y-3 mb-6">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Booking Reference</div>
              <div className="font-mono font-bold text-forest-700 text-lg">{b.bookingReference}</div>
            </div>
            <hr className="border-forest-100" />
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-forest-600 mt-0.5 shrink-0" />
                <span>{b.groundName}, {b.groundCity}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-forest-600 shrink-0" />
                <span>{formatDate(b.bookingDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4 text-forest-600 shrink-0" />
                <span>{slotTypeLabel(b.slotType)} · {b.startTime} – {b.endTime}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-forest-100 font-semibold text-gray-900">
                <span>Total Paid</span>
                <span className="text-forest-700">{formatCurrency(b.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Payment</span>
                <span>{b.paymentMethod === 'PAY_AT_GROUND' ? 'Pay at Ground' : 'Online (Sandbox)'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/dashboard" className="w-full btn-primary justify-center">
              View My Bookings
            </Link>
            <Link to="/grounds" className="w-full btn-secondary justify-center">
              Book Another Ground
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
