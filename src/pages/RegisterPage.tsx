import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { TreePine, Mail, Lock, User, Phone, Loader2, Eye, EyeOff, WifiOff } from 'lucide-react';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'OWNER' ? 'OWNER' : 'CUSTOMER';

  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', role: defaultRole });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      // Try real backend first
      const res = await authApi.register(form);
      login(res.data.token, res.data.user);
      toast.success('Account created!');
      if (form.role === 'OWNER') navigate('/owner');
      else navigate('/grounds');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 400 || status === 409) {
        // Real backend error (e.g. email already exists)
        toast.error(err?.response?.data?.message || 'Registration failed. Email may already be in use.');
      } else {
        // Backend offline — create demo session
        const demoUser = {
          id: `demo-${Date.now()}`,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          role: form.role as 'CUSTOMER' | 'OWNER' | 'ADMIN',
        };
        login('demo-token-' + Date.now(), demoUser);
        toast.success(`Welcome, ${form.fullName}! (Demo mode — backend offline)`, { duration: 4000 });
        if (form.role === 'OWNER') navigate('/owner');
        else navigate('/grounds');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-forest-700">
            <span className="w-10 h-10 bg-forest-600 rounded-xl flex items-center justify-center">
              <TreePine className="w-6 h-6 text-white" />
            </span>
            OpenGround
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands of cricket enthusiasts</p>
        </div>

        <div className="card p-6">
          {/* Role toggle */}
          <div className="flex rounded-xl border border-gray-200 p-1 mb-5">
            {['CUSTOMER', 'OWNER'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, role: r }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  form.role === r ? 'bg-forest-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {r === 'CUSTOMER' ? '🏏 Player' : '🏟️ Ground Owner'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Full Name" className="input-field pl-10" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="Email address" className="input-field pl-10" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)" className="input-field pl-10" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
                placeholder="Password (min 8 characters)"
                className="input-field pl-10 pr-10"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-3.5 text-gray-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 disabled:opacity-70">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : 'Create Account'}
            </button>
          </form>

          {/* Demo mode note */}
          <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            <WifiOff className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>If the backend is offline, you'll be signed in with a <strong>demo session</strong> for browsing. Real bookings require the live backend.</span>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-forest-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
