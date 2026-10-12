import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import GroundsPage from './pages/GroundsPage';
import GroundDetailPage from './pages/GroundDetailPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmedPage from './pages/BookingConfirmedPage';
import DashboardPage from './pages/DashboardPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage, {
  ContactPage, TermsPage, PrivacyPage, CancellationPage, NotFoundPage
} from './pages/StaticPages';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: '12px', background: '#fff', color: '#1a1a1a', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/grounds" element={<GroundsPage />} />
            <Route path="/grounds/:slug" element={<GroundDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cancellation" element={<CancellationPage />} />

            {/* Protected routes */}
            <Route path="/book/:groundId" element={
              <ProtectedRoute><BookingPage /></ProtectedRoute>
            } />
            <Route path="/booking-confirmed" element={
              <ProtectedRoute><BookingConfirmedPage /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="CUSTOMER"><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/owner" element={
              <ProtectedRoute requiredRole="OWNER"><OwnerDashboardPage /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ADMIN"><AdminDashboardPage /></ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
