import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Star, Zap, TreePine, Loader2, WifiOff } from 'lucide-react';
import { groundsApi } from '../api/client';
import { GroundSummary, PitchType } from '../types';
import { formatCurrency, pitchTypeLabel } from '../utils/helpers';
import { DEMO_GROUNDS } from '../data/demoData';

export default function GroundsPage() {
  const [searchParams] = useSearchParams();
  const [grounds, setGrounds] = useState<GroundSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [city, setCity] = useState(searchParams.get('city') || '');
  const [pitchType, setPitchType] = useState<PitchType | ''>('');
  const [floodlights, setFloodlights] = useState<boolean | undefined>(undefined);
  const [maxRate, setMaxRate] = useState('');
  const [searchText, setSearchText] = useState('');

  const filterDemo = (data: GroundSummary[]) => {
    let result = data;
    if (city) result = result.filter(g => g.city.toLowerCase().includes(city.toLowerCase()) || g.state.toLowerCase().includes(city.toLowerCase()));
    if (pitchType) result = result.filter(g => g.pitchType === pitchType);
    if (floodlights !== undefined) result = result.filter(g => g.floodlights === floodlights);
    if (maxRate) result = result.filter(g => g.hourlyBaseRate <= Number(maxRate));
    if (searchText) result = result.filter(g => g.name.toLowerCase().includes(searchText.toLowerCase()));
    return result;
  };

  const fetchGrounds = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {};
      if (city) params.city = city;
      if (pitchType) params.pitchType = pitchType;
      if (floodlights !== undefined) params.floodlights = String(floodlights);
      if (maxRate) params.maxHourlyRate = Number(maxRate);
      if (searchText) params.search = searchText;
      const res = await groundsApi.search(params);
      setGrounds(res.data);
      setIsDemo(false);
    } catch {
      // Backend unavailable — use demo data
      setGrounds(filterDemo(DEMO_GROUNDS));
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGrounds(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      setGrounds(filterDemo(DEMO_GROUNDS));
    } else {
      fetchGrounds();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-forest-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-1">Find Outdoor Cricket Grounds</h1>
          <p className="text-forest-200 text-sm">Large outdoor grounds only · 55m+ boundary · Full-size pitches</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Demo mode banner */}
        {isDemo && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>
              <strong>Demo Mode</strong> — Showing sample grounds. Connect the backend for live data.
              <a href="https://github.com/24eg105t28-rr/openground-backend" target="_blank" rel="noreferrer" className="ml-1 underline">Setup guide →</a>
            </span>
          </div>
        )}

        {/* Search bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5">
            <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="flex-1 outline-none text-sm text-gray-900 placeholder-gray-400" />
          </div>
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-forest-600 shrink-0" />
            <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Ground name..." className="flex-1 outline-none text-sm text-gray-900 placeholder-gray-400" />
          </div>
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <button type="submit" className="btn-primary text-sm"><Search className="w-4 h-4" /> Search</button>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Pitch Type</label>
              <select value={pitchType} onChange={e => setPitchType(e.target.value as PitchType | '')} className="input-field py-2 text-sm">
                <option value="">All Types</option>
                <option value="NATURAL_GRASS">Natural Grass</option>
                <option value="ARTIFICIAL_TURF">Artificial Turf</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Floodlights</label>
              <select value={floodlights === undefined ? '' : String(floodlights)} onChange={e => setFloodlights(e.target.value === '' ? undefined : e.target.value === 'true')} className="input-field py-2 text-sm">
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Max Hourly Rate (₹)</label>
              <input type="number" value={maxRate} onChange={e => setMaxRate(e.target.value)} placeholder="e.g. 3000" className="input-field py-2 text-sm" />
            </div>
          </div>
        )}

        {loading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-forest-600 animate-spin" /></div>}

        {!loading && grounds.length === 0 && (
          <div className="text-center py-20">
            <TreePine className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No grounds found.</p>
            <p className="text-gray-400 text-sm mt-1">Try a different city or remove filters.</p>
          </div>
        )}

        {!loading && grounds.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">{grounds.length} outdoor cricket ground{grounds.length !== 1 ? 's' : ''} found{isDemo ? ' (demo)' : ''}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {grounds.map(g => <GroundCard key={g.id} ground={g} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function GroundCard({ ground }: { ground: GroundSummary }) {
  return (
    <Link to={`/grounds/${ground.slug}`} className="card hover:shadow-md transition-shadow group">
      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={ground.primaryImageUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'}
          alt={ground.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 leading-snug">{ground.name}</h3>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{ground.averageRating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5" /> {ground.city}, {ground.state}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge bg-forest-100 text-forest-700">{pitchTypeLabel(ground.pitchType)}</span>
          <span className="badge bg-gray-100 text-gray-700">{ground.boundaryRadiusMeters}m boundary</span>
          {ground.floodlights && <span className="badge bg-yellow-100 text-yellow-700 flex items-center gap-1"><Zap className="w-3 h-3" /> Floodlit</span>}
        </div>
        {ground.keyFacilities.length > 0 && <p className="text-xs text-gray-400 mb-3">{ground.keyFacilities.join(' · ')}</p>}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-forest-700">{formatCurrency(ground.hourlyBaseRate)}</span>
            <span className="text-xs text-gray-400">/hr base</span>
          </div>
          <span className="text-forest-600 font-medium text-sm">Book Now →</span>
        </div>
      </div>
    </Link>
  );
}
