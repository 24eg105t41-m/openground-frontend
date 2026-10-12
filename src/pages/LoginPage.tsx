import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fill = (email: string, password: string) => setForm({ email, password });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.fullName.split(' ')[0]}!`);
      const role = res.data.user.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'OWNER') navigate('/owner');
      else navigate('/grounds');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid email or password');
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

          {/* Quick-fill demo credentials */}
          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 text-center mb-2">Quick sign-in with demo accounts</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '🏏 Player', email: 'customer@openground.in', pw: 'password123' },
                { label: '🏟️ Owner', email: 'owner@centurion.com', pw: 'password123' },
                { label: '🔧 Admin', email: 'admin@openground.in', pw: 'admin123' },
              ].map(d => (
                <button key={d.label} type="button" onClick={() => fill(d.email, d.pw)}
                  className="text-xs border border-gray-200 rounded-lg py-1.5 px-2 text-gray-600 hover:border-forest-400 hover:text-forest-700 transition-colors">
                  {d.label}
                </button>
              ))}
            </div>
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
