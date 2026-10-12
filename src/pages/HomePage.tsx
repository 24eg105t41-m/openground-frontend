import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, Star, Shield, Clock, ChevronRight, TreePine, Sun, Moon, Sunset, Calendar } from 'lucide-react';
import { useState } from 'react';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80';
const GROUNDS_IMAGE = 'https://images.unsplash.com/photo-1593766827344-ea73c07cf78a?auto=format&fit=crop&w=800&q=80';

const FEATURES = [
  { icon: Shield, title: 'Verified Large Grounds', desc: 'Every ground is verified to be full-size outdoor (55m+ boundary radius). No box cricket, no enclosed turf cages.' },
  { icon: Clock, title: 'Instant Slot Booking', desc: 'Book Morning, Afternoon, Evening or Full-Day sessions in real time. No double-bookings guaranteed.' },
  { icon: Star, title: 'Trusted Reviews', desc: 'Authentic ratings from verified players who completed their booking.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Search Your City', desc: 'Enter your city and pick a date to see available large outdoor cricket grounds.' },
  { step: '02', title: 'Choose a Session', desc: 'Pick Morning, Afternoon, Evening Floodlit, or Full Day slot at your preferred ground.' },
  { step: '03', title: 'Confirm & Pay', desc: 'Review pricing, choose Pay-at-Ground or Sandbox Online, and confirm your booking instantly.' },
  { step: '04', title: 'Play Cricket!', desc: 'Arrive at the ground with your booking reference. Enjoy the full-size outdoor pitch.' },
];

const POPULAR_CITIES = ['Mumbai', 'Pune', 'Bengaluru', 'Hyderabad', 'Chennai', 'Delhi', 'Ahmedabad', 'Jaipur'];

export default function HomePage() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (date) params.set('date', date);
    navigate(`/grounds?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Large outdoor cricket ground" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-900/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-forest-600/20 border border-forest-500/30 rounded-full px-4 py-1.5 text-forest-200 text-sm font-medium mb-6">
              <TreePine className="w-4 h-4" /> Large Outdoor Cricket Grounds Only
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Book India's Best<br />
              <span className="text-forest-300">Outdoor Cricket</span><br />
              Grounds
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Full-size natural grass and artificial turf cricket grounds. 55m+ boundary radius. Morning to evening sessions. Instant confirmation.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3">
                <MapPin className="w-5 h-5 text-forest-600 shrink-0" />
                <input
                  type="text"
                  placeholder="City (e.g. Mumbai, Pune...)"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="flex-1 outline-none text-gray-900 text-sm placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 sm:w-48">
                <Calendar className="w-5 h-5 text-forest-600 shrink-0" />
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setDate(e.target.value)}
                  className="flex-1 outline-none text-gray-900 text-sm"
                />
              </div>
              <button type="submit" className="btn-primary">
                <Search className="w-5 h-5" /> Search
              </button>
            </form>

            {/* Popular cities */}
            <div className="mt-4 flex flex-wrap gap-2">
              {POPULAR_CITIES.map(c => (
                <button
                  key={c}
                  onClick={() => navigate(`/grounds?city=${c}`)}
                  className="text-xs text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5 transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why OpenGround?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We connect cricket teams with full-size outdoor grounds — no compromise on space, quality, or convenience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6">
                <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-forest-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Session types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Available Sessions</h2>
            <p className="text-gray-500">Every booking is exclusive — your team gets the full ground for the session.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Sun, label: 'Morning', time: '7:00 AM – 11:30 AM', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
              { icon: Sun, label: 'Afternoon', time: '12:00 PM – 4:30 PM', color: 'bg-orange-50 border-orange-200 text-orange-700' },
              { icon: Sunset, label: 'Evening (Floodlit)', time: '5:00 PM – 9:30 PM', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { icon: Calendar, label: 'Full Day', time: '7:00 AM – 5:00 PM', color: 'bg-forest-50 border-forest-200 text-forest-700' },
            ].map(({ icon: Icon, label, time, color }) => (
              <div key={label} className={`rounded-2xl border-2 p-5 text-center ${color}`}>
                <Icon className="w-8 h-8 mx-auto mb-3" />
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-xs mt-1 opacity-75">{time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-forest-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-forest-300">From search to stumps in 4 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-forest-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-forest-300 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/grounds" className="btn-primary text-base px-8 py-4">
              Find Outdoor Grounds <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Own a Large Outdoor Cricket Ground?</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">List your ground on OpenGround and start receiving verified bookings. Only full-size outdoor grounds accepted (55m+ boundary radius).</p>
          <Link to="/register?role=OWNER" className="btn-primary text-base px-8 py-4">
            List Your Ground <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
