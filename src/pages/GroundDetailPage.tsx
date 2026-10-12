import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Star, Zap, Shield, ChevronLeft, Calendar, Check, Loader2,
  Sun, AlertCircle, WifiOff
} from 'lucide-react';
import { groundsApi } from '../api/client';
import { GroundDetail, PricingSlot, SlotType } from '../types';
import { formatCurrency, pitchTypeLabel, slotTypeLabel, formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { getDemoGroundDetail } from '../data/demoData';

export default function GroundDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [ground, setGround] = useState<GroundDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<PricingSlot | null>(null);
  const [date, setDate] = useState('');
  const [imgIdx, setImgIdx] = useState(0);
  const [price, setPrice] = useState<{ total: number; base: number; tax: number } | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    groundsApi.getBySlug(slug)
      .then(r => { setGround(r.data); setIsDemo(false); })
      .catch(() => {
        try {
          setGround(getDemoGroundDetail(slug));
          setIsDemo(true);
        } catch {
          setError('Ground not found.');
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!ground || !selectedSlot || !date) { setPrice(null); return; }
    if (isDemo) {
      // Calculate price client-side in demo mode
      const base = selectedSlot.weekdayPrice;
      const tax = base * 0.18;
      setPrice({ total: base + tax, base, tax });
      return;
    }
    setPriceLoading(true);
    groundsApi.getPrice(ground.id, selectedSlot.id, date)
      .then(r => setPrice({ total: r.data.totalPrice, base: r.data.basePrice, tax: r.data.tax }))
      .catch(() => {
        const base = selectedSlot.weekdayPrice;
        const tax = base * 0.18;
        setPrice({ total: base + tax, base, tax });
      })
      .finally(() => setPriceLoading(false));
  }, [ground, selectedSlot, date]);

  const handleBook = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!ground || !selectedSlot || !date) return;
    if (isDemo) {
      navigate('/login');
      return;
    }
    navigate(`/book/${ground.id}`, { state: { slot: selectedSlot, date, ground } });
  };

  const slotIcon = (type: SlotType) => {
    if (type === 'MORNING') return <Sun className="w-5 h-5 text-yellow-500" />;
    if (type === 'AFTERNOON') return <Sun className="w-5 h-5 text-orange-500" />;
    if (type === 'EVENING') return <Zap className="w-5 h-5 text-purple-500" />;
    return <Calendar className="w-5 h-5 text-forest-600" />;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 text-forest-600 animate-spin" /></div>;
  if (error || !ground) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <p className="text-gray-600">{error || 'Ground not found'}</p>
      <Link to="/grounds" className="btn-outline">Back to Grounds</Link>
    </div>
  );

  const images = ground.images?.length > 0
    ? ground.images
    : [{ id: '0', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80', isPrimary: true }];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/grounds" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-forest-700 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Search
        </Link>

        {isDemo && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span><strong>Demo Mode</strong> — This is sample data. Booking requires the live backend.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card overflow-hidden">
              <div className="relative h-72 sm:h-96 bg-gray-100">
                <img src={images[imgIdx]?.imageUrl} alt={ground.name} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-forest-100 text-forest-700">{pitchTypeLabel(ground.pitchType)}</span>
                  <span className="badge bg-gray-100 text-gray-700">{ground.boundaryRadiusMeters}m boundary</span>
                  {ground.floodlights && <span className="badge bg-yellow-100 text-yellow-700 flex items-center gap-1"><Zap className="w-3 h-3" /> Floodlit</span>}
                  {ground.seatingCapacity && <span className="badge bg-blue-100 text-blue-700">{ground.seatingCapacity.toLocaleString()} seats</span>}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{ground.name}</h1>
                <p className="text-gray-500 flex items-center gap-1 text-sm mb-2">
                  <MapPin className="w-4 h-4" /> {ground.address}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(ground.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                  </div>
                  <span className="text-sm text-gray-600">{ground.averageRating.toFixed(1)} ({ground.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {ground.description && (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 mb-2">About This Ground</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{ground.description}</p>
                {ground.pavilionDetails && <p className="text-gray-500 text-sm mt-2 italic">{ground.pavilionDetails}</p>}
              </div>
            )}

            {ground.facilities?.length > 0 && (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ground.facilities.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-forest-600 shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ground.reviews?.length > 0 && (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 mb-4">Reviews</h2>
                <div className="space-y-4">
                  {ground.reviews.slice(0, 5).map(r => (
                    <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 bg-forest-100 rounded-full flex items-center justify-center text-forest-700 text-xs font-bold">
                          {r.reviewerName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{r.reviewerName}</span>
                        <div className="flex ml-auto">
                          {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 ml-9">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking panel */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-20">
              <h2 className="font-semibold text-gray-900 mb-4">Book a Session</h2>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-1">Select Date</label>
                <input type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} className="input-field" />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">Select Session</label>
                <div className="space-y-2">
                  {ground.slots?.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(selectedSlot?.id === slot.id ? null : slot)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors text-left ${selectedSlot?.id === slot.id ? 'border-forest-500 bg-forest-50' : 'border-gray-200 hover:border-forest-300'}`}
                    >
                      {slotIcon(slot.slotType)}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{slotTypeLabel(slot.slotType)}</div>
                        <div className="text-xs text-gray-500">{slot.startTime} – {slot.endTime}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-forest-700">{formatCurrency(slot.weekdayPrice)}</div>
                        <div className="text-xs text-gray-400">weekday</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedSlot && date && price && (
                <div className="mb-4 bg-forest-50 rounded-xl p-3">
                  {priceLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</div>
                  ) : (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-gray-600"><span>Base price</span><span>{formatCurrency(price.base)}</span></div>
                      <div className="flex justify-between text-gray-600"><span>Tax (18% GST)</span><span>{formatCurrency(price.tax)}</span></div>
                      <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-forest-200">
                        <span>Total</span><span className="text-forest-700 text-base">{formatCurrency(price.total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={!selectedSlot || !date}
                className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDemo ? 'Sign In to Book (Live Mode)' : isAuthenticated ? 'Proceed to Booking' : 'Sign In to Book'}
              </button>

              <div className="mt-3 flex items-center gap-1 text-xs text-gray-400 justify-center">
                <Shield className="w-3 h-3" /> Exclusive ground booking · No double-booking
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
