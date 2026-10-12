import { Link } from 'react-router-dom';
import { TreePine, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <span className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
                <TreePine className="w-5 h-5 text-white" />
              </span>
              OpenGround
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              India's premier booking platform exclusively for large outdoor cricket grounds. Full-size pitches, professional facilities, seamless booking.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Exclusively for full-size outdoor cricket grounds (55m+ boundary radius). No box cricket, no turf cages, no batting lanes.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/grounds" className="hover:text-forest-300 transition-colors">Find Grounds</Link></li>
              <li><Link to="/register?role=OWNER" className="hover:text-forest-300 transition-colors">List Your Ground</Link></li>
              <li><Link to="/dashboard" className="hover:text-forest-300 transition-colors">My Bookings</Link></li>
              <li><Link to="/about" className="hover:text-forest-300 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-forest-300 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-forest-300 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cancellation" className="hover:text-forest-300 transition-colors">Cancellation Policy</Link></li>
              <li><Link to="/contact" className="hover:text-forest-300 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-forest-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">&copy; 2026 OpenGround (24eg105t41). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:contact@openground.in" className="text-gray-400 hover:text-forest-300 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <a href="https://github.com/24eg105t41" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-forest-300 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
