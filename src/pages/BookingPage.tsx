import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Shield, CreditCard, MapPin, Calendar, Clock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { bookingsApi, groundsApi } from '../api/client';
import { GroundDetail, PricingSlot, PaymentMethod } from '../types';
import { formatCurrency, slotTypeLabel, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

interface LocationState {
  slot: PricingSlot;
  date: string;
  ground: GroundDetail;
}

export default function BookingPage() {
  const { groundId } = useParams<{ groundId: string }>();
  const { state } = useLocation() as { state: LocationState | null };
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PAY_AT_GROUND');
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState<{ total: number; base: number; tax: number } | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);

  useEffect(() => {
    if (!state) return;
    groundsApi.getPrice(state.ground.id, state.slot.id, state.date)
      .then(r => setPrice({ total: r.data.totalPrice, base: r.data.basePrice, tax: r.data.tax }))
      .catch(() => setPrice({ total: state.slot.weekdayPrice * 1.18, base: state.slot.weekdayPrice, tax: state.slot.weekdayPrice * 0.18 }))
      .finally(() => setPriceLoading(false));
  }, [state]);

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-600">No booking details found.</p>
        <button onClick={() => navigate('/grounds')} className="btn-primary">Browse Grounds</button>
      </div>
    );
  }

  const { slot, date, ground } = state;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await bookingsApi.create({
        groundId: ground.id,
        pricingSlotId: slot.id,
        bookingDate: date,
        paymentMethod,
      });
      toast.success('Booking confirmed!');
      navigate('/booking-confirmed', { state: { booking: res.data } });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Booking failed. The slot may already be taken.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirm Booking</h1>

        {/* Ground summary */}
        <div className="card p-5 mb-5">
          <div className="flex gap-4">
            <img
              src={ground.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=200&q=80'}
              alt={ground.name}
              className="w-24 h-24 object-cover rounded-xl shrink-0"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{ground.name}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" /> {ground.city}, {ground.state}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-forest-600" /> {formatDate(date)}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-forest-600" /> {slotTypeLabel(slot.slotType)} · {slot.startTime} – {slot.endTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-5 mb-5">
          <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
          {priceLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</div>
          ) : price ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Session price ({slotTypeLabel(slot.slotType)})</span>
                <span>{formatCurrency(price.base)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (18%)</span>
                <span>{formatCurrency(price.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-forest-700">{formatCurrency(price.total)}</span>
              </div>
            </div>
          ) : null}
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Price confirmed on server — not editable by client.
          </p>
        </div>

        {/* Payment method */}
        <div className="card p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="space-y-3">
            {([
              { value: 'PAY_AT_GROUND', label: 'Pay at Ground', desc: 'Pay cash or UPI when you arrive at the ground.', icon: MapPin },
              { value: 'ONLINE_SANDBOX', label: 'Online Payment (Sandbox)', desc: 'Simulated online payment. No real money charged.', icon: CreditCard },
            ] as const).map(({ value, label, desc, icon: Icon }) => (
              <label
                key={value}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === value ? 'border-forest-500 bg-forest-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value={value}
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                  className="accent-forest-600"
                />
                <Icon className="w-5 h-5 text-forest-600 shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full btn-primary justify-center py-4 text-base disabled:opacity-70"
        >
          {submitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Confirming...</>
          ) : (
            <>Confirm Booking — {price ? formatCurrency(price.total) : '...'}</>
          )}
        </button>
        <p className="text-xs text-center text-gray-400 mt-3">By confirming, you agree to the cancellation and ground-use policies.</p>
      </div>
    </div>
  );
}
