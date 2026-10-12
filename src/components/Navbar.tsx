import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, TreePine, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'OWNER') return '/owner';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-forest-700">
            <span className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
              <TreePine className="w-5 h-5 text-white" />
            </span>
            OpenGround
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/grounds" className={({ isActive }) =>
              clsx('font-medium text-sm transition-colors', isActive ? 'text-forest-700' : 'text-gray-600 hover:text-forest-700')
            }>Find Grounds</NavLink>
            <NavLink to="/about" className={({ isActive }) =>
              clsx('font-medium text-sm transition-colors', isActive ? 'text-forest-700' : 'text-gray-600 hover:text-forest-700')
            }>About</NavLink>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-forest-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.fullName.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-forest-50"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link to="/grounds" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">Find Grounds</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">About</Link>
          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()} onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">Dashboard</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block py-2 text-red-600 font-medium">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-forest-700 font-semibold">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
