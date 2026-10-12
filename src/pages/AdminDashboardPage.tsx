import { useState, useEffect } from 'react';
import { adminApi } from '../api/client';
import { GroundSummary } from '../types';
import { formatCurrency } from '../utils/helpers';
import { Check, Ban, Loader2, Users, TreePine, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'grounds' | 'users' | 'bookings'>('grounds');
  const [grounds, setGrounds] = useState<GroundSummary[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actioning, setActioning] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'grounds') {
        const res = await adminApi.allGrounds();
        setGrounds(res.data);
      } else if (tab === 'users') {
        const res = await adminApi.allUsers();
        setUsers(res.data);
      } else {
        const res = await adminApi.allBookings();
        setBookings(res.data);
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [tab]);

  const handleApprove = async (id: string) => {
    setActioning(id);
    try {
      await adminApi.approveGround(id);
      toast.success('Ground approved');
      fetchData();
    } catch { toast.error('Failed to approve'); } finally { setActioning(null); }
  };

  const handleSuspend = async (id: string) => {
    setActioning(id);
    try {
      await adminApi.suspendGround(id);
      toast.success('Ground suspended');
      fetchData();
    } catch { toast.error('Failed to suspend'); } finally { setActioning(null); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { key: 'grounds', label: 'Grounds', icon: TreePine },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'bookings', label: 'Bookings', icon: Calendar },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === key ? 'border-forest-600 text-forest-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {loading && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-forest-600 animate-spin" /></div>}

        {/* Grounds tab */}
        {!loading && tab === 'grounds' && (
          <div className="space-y-3">
            {grounds.map(g => (
              <div key={g.id} className="card p-4 flex items-center gap-4">
                <img src={g.primaryImageUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=100&q=80'} alt={g.name} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{g.name}</p>
                  <p className="text-sm text-gray-500">{g.city}, {g.state} · {g.boundaryRadiusMeters}m · {formatCurrency(g.hourlyBaseRate)}/hr</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(g.id)} disabled={actioning === g.id} className="flex items-center gap-1 text-xs text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                    {actioning === g.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Approve
                  </button>
                  <button onClick={() => handleSuspend(g.id)} disabled={actioning === g.id} className="flex items-center gap-1 text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                    <Ban className="w-3 h-3" /> Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users tab */}
        {!loading && tab === 'users' && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : u.role === 'OWNER' ? 'bg-forest-100 text-forest-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bookings tab */}
        {!loading && tab === 'bookings' && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Reference</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Ground</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.bookingReference}</td>
                    <td className="px-4 py-3 text-gray-900">{b.groundName}</td>
                    <td className="px-4 py-3 text-gray-600">{b.bookingDate}</td>
                    <td className="px-4 py-3 font-semibold text-forest-700">{formatCurrency(b.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
