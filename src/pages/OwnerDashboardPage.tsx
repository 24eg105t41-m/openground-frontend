import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ownerApi } from '../api/client';
import { GroundSummary } from '../types';
import { formatCurrency, pitchTypeLabel } from '../utils/helpers';
import { Plus, MapPin, Loader2, TreePine, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const [grounds, setGrounds] = useState<GroundSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', address: '', city: '', state: '',
    boundaryRadiusMeters: 65, pitchType: 'NATURAL_GRASS',
    floodlights: false, seatingCapacity: 1000, hourlyBaseRate: 2000,
    pavilionDetails: '', facilities: '', imageUrls: '',
  });

  useEffect(() => {
    ownerApi.myGrounds()
      .then(r => setGrounds(r.data))
      .catch(() => toast.error('Failed to load grounds'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              ['boundaryRadiusMeters', 'seatingCapacity', 'hourlyBaseRate'].includes(name) ? Number(value) : value,
    }));
  };

  const handleAddGround = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.boundaryRadiusMeters < 55) { toast.error('Minimum 55m boundary required (large outdoor grounds only)'); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        facilities: form.facilities.split(',').map(s => s.trim()).filter(Boolean),
        imageUrls: form.imageUrls.split(',').map(s => s.trim()).filter(Boolean),
      };
      await ownerApi.createGround(payload);
      toast.success('Ground listed successfully!');
      setShowForm(false);
      const res = await ownerApi.myGrounds();
      setGrounds(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create ground');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-500 text-sm">{user?.fullName} · Ground Owner</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Ground'}
          </button>
        </div>

        {/* Add Ground Form */}
        {showForm && (
          <form onSubmit={handleAddGround} className="card p-6 mb-6 space-y-4">
            <h2 className="font-semibold text-gray-900 text-lg">List a New Outdoor Cricket Ground</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
              ⚠️ OpenGround exclusively lists <strong>large outdoor cricket grounds</strong> (minimum 55m boundary radius). Box cricket, indoor cricket, and turf cages are not permitted.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Ground Name *" className="input-field" />
              <input name="city" required value={form.city} onChange={handleChange} placeholder="City *" className="input-field" />
              <input name="state" required value={form.state} onChange={handleChange} placeholder="State *" className="input-field" />
              <input name="address" required value={form.address} onChange={handleChange} placeholder="Full Address *" className="input-field" />
              <div>
                <label className="text-xs text-gray-500 block mb-1">Boundary Radius (meters, min 55)</label>
                <input name="boundaryRadiusMeters" type="number" min="55" max="100" required value={form.boundaryRadiusMeters} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Pitch Type</label>
                <select name="pitchType" value={form.pitchType} onChange={handleChange} className="input-field">
                  <option value="NATURAL_GRASS">Natural Grass</option>
                  <option value="ARTIFICIAL_TURF">Artificial Turf</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Hourly Base Rate (₹)</label>
                <input name="hourlyBaseRate" type="number" min="500" required value={form.hourlyBaseRate} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Seating Capacity</label>
                <input name="seatingCapacity" type="number" min="0" value={form.seatingCapacity} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input name="floodlights" type="checkbox" checked={form.floodlights} onChange={handleChange} className="accent-forest-600 w-4 h-4" />
              Ground has floodlights
            </label>
            <textarea name="description" value={form.description} onChange={handleChange as any} placeholder="Description" rows={3} className="input-field resize-none" />
            <input name="facilities" value={form.facilities} onChange={handleChange} placeholder="Facilities (comma-separated, e.g. Parking, Dressing Room, Cafeteria)" className="input-field" />
            <input name="imageUrls" value={form.imageUrls} onChange={handleChange} placeholder="Image URLs (comma-separated)" className="input-field" />
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-70">
              {submitting ? 'Submitting...' : 'Submit Ground Listing'}
            </button>
          </form>
        )}

        {/* Grounds list */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Grounds ({grounds.length})</h2>
        {loading && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-forest-600 animate-spin" /></div>}
        {!loading && grounds.length === 0 && (
          <div className="card p-10 text-center">
            <TreePine className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No grounds listed yet. Add your first large outdoor cricket ground.</p>
          </div>
        )}
        {!loading && grounds.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grounds.map(g => (
              <Link to={`/grounds/${g.slug}`} key={g.id} className="card p-4 flex gap-4 hover:shadow-md transition-shadow">
                <img src={g.primaryImageUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=200&q=80'} alt={g.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{g.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {g.city}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="badge bg-forest-100 text-forest-700 text-xs">{pitchTypeLabel(g.pitchType)}</span>
                    {g.floodlights && <span className="badge bg-yellow-100 text-yellow-700 text-xs"><Zap className="w-3 h-3 inline" /> Floodlit</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatCurrency(g.hourlyBaseRate)}/hr base · {g.boundaryRadiusMeters}m</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
