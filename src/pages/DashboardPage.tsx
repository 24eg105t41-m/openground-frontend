import { useState, useEffect } from 'react';
import { bookingsApi } from '../api/client';
import { Booking } from '../types';
import { formatCurrency, slotTypeLabel, bookingStatusColor, formatDate } from '../utils/helpers';
import { Calendar, MapPin, Loader2, TreePine, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingsApi.myBookings();
      setBookings(res.data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await bookingsApi.cancel(id);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cannot cancel this booking');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.fullName}</p>
        </div>

        {/* Profile card */}
        <div className="card p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.fullName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <span className="ml-auto badge bg-forest-100 text-forest-700">{user?.role}</span>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Bookings</h2>

        {loading && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-forest-600 animate-spin" /></div>}

        {!loading && bookings.length === 0 && (
          <div className="card p-10 text-center">
            <TreePine className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No bookings yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-5">Find a large outdoor cricket ground and book your first session.</p>
            <Link to="/grounds" className="btn-primary">Find Grounds</Link>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${bookingStatusColor(b.status)}`}>{b.status}</span>
                    <span className="font-mono text-xs text-gray-400">{b.bookingReference}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{b.groundName}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {b.groundCity}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(b.bookingDate)}</span>
                    <span>{slotTypeLabel(b.slotType)} · {b.startTime} – {b.endTime}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-lg font-bold text-forest-700">{formatCurrency(b.totalAmount)}</div>
                  {(b.status === 'CONFIRMED' || b.status === 'PENDING') && (
                    <button onClick={() => handleCancel(b.id)} disabled={cancelling === b.id}
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50">
                      {cancelling === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
