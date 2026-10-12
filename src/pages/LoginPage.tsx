import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, Mail, Lock, Loader2, Eye, EyeOff, WifiOff } from 'lucide-react';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Demo accounts for offline mode
const DEMO_ACCOUNTS = [
  { email: 'customer@openground.in', password: 'password123', fullName: 'Demo Customer', role: 'CUSTOMER' as const },
  { email: 'owner@centurion.com',    password: 'password123', fullName: 'Ground Owner',  role: 'OWNER' as const },
  { email: 'admin@openground.in',    password: 'admin123',    fullName: 'Admin User',    role: 'ADMIN' as const },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Try real backend
      const res = await authApi.login(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.fullName.split(' ')[0]}!`);
      const role = res.data.user.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'OWNER') navigate('/owner');
      else navigate('/grounds');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Invalid email or password');
      } else {
        // Backend offline — try demo accounts
        const demo = DEMO_ACCOUNTS.find(
          a => a.email === form.email && a.password === form.password
        );
        if (demo) {
          login('demo-token-' + Date.now(), {
            id: `demo-${demo.role}`,
            fullName: demo.fullName,
            email: demo.email,
            role: demo.role,
          });
          toast.success(`Welcome, ${demo.fullName}! (Demo mode)`, { duration: 4000 });
          if (demo.role === 'ADMIN') navigate('/admin');
          else if (demo.role === 'OWNER') navigate('/owner');
          else navigate('/grounds');
        } else {
          // Any credentials — create generic demo session
          const name = form.email.split('@')[0];
          login('demo-token-' + Date.now(), {
            id: `demo-${Date.now()}`,
            fullName: name.charAt(0).toUpperCase() + name.slice(1),
            email: form.email,
            role: 'CUSTOMER',
          });
          toast.success(`Signed in as ${name} (Demo mode)`, { duration: 4000 });
          navigate('/grounds');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-forest-700">
            <span className="w-10 h-10 bg-forest-600 rounded-xl flex items-center justify-center">
              <TreePine className="w-6 h-6 text-white" />
            </span>
            OpenGround
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="card p-6">
          {/* Demo credentials */}
          <div className="bg-forest-50 border border-forest-200 rounded-xl p-3 mb-4 text-xs text-forest-800">
            <p className="font-semibold mb-1">Demo Credentials (works offline too):</p>
            <p>🏏 Player: <span className="font-mono">customer@openground.in</span> / <span className="font-mono">password123</span></p>
            <p>🏟️ Owner: <span className="font-mono">owner@centurion.com</span> / <span className="font-mono">password123</span></p>
            <p>🔧 Admin: <span className="font-mono">admin@openground.in</span> / <span className="font-mono">admin123</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="Email address" className="input-field pl-10" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="input-field pl-10 pr-10"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-3.5 text-gray-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 disabled:opacity-70">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            <WifiOff className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>Backend offline? Any email/password will sign you in with a <strong>demo session</strong>.</span>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-forest-600 font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
