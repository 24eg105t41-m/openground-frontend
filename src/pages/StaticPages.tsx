import { Link } from 'react-router-dom';
import { TreePine } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-forest-800 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <TreePine className="w-12 h-12 text-forest-300 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">About OpenGround</h1>
          <p className="text-forest-200 text-lg">India's premier booking platform exclusively for large outdoor cricket grounds.</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">OpenGround was built to solve a real problem: finding and booking large, full-size outdoor cricket grounds in India is fragmented, opaque, and frustrating. We connect cricket teams directly with verified ground owners through a seamless digital booking experience.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Standard</h2>
          <div className="bg-forest-50 border border-forest-200 rounded-2xl p-5">
            <p className="text-forest-800 font-semibold mb-2">Strictly Large Outdoor Cricket Grounds Only</p>
            <ul className="text-forest-700 text-sm space-y-1">
              <li>✓ Full-size natural grass turf (55m–80m+ boundary radius)</li>
              <li>✓ Full-size artificial turf outdoor grounds</li>
              <li>✓ Grounds with pavilions, sightscreens, and proper cricket infrastructure</li>
              <li>✗ No box cricket courts</li>
              <li>✗ No indoor cricket facilities</li>
              <li>✗ No small enclosed turf cages</li>
              <li>✗ No individual batting lane bookings</li>
            </ul>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Project Details</h2>
          <p className="text-gray-600">Project Identifier: <strong>24eg105t41</strong><br />Built with Java 21, Spring Boot, PostgreSQL, React, TypeScript, and Tailwind CSS.</p>
        </section>
        <div className="text-center pt-4">
          <Link to="/grounds" className="btn-primary">Find a Ground</Link>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-500 mb-6">For questions about bookings, ground listings, or partnerships:</p>
        <a href="mailto:contact@openground.in" className="text-forest-600 text-lg font-medium hover:underline">contact@openground.in</a>
        <div className="mt-8"><Link to="/" className="btn-outline">Back to Home</Link></div>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="prose text-gray-600 space-y-4 text-sm">
          <p>OpenGround is exclusively for large outdoor cricket ground bookings. By using this platform you agree to these terms.</p>
          <p><strong>Booking:</strong> Bookings are for the exclusive use of the entire ground for the selected session. The booking is confirmed upon payment and subject to the ground owner's rules.</p>
          <p><strong>Cancellation:</strong> See our cancellation policy for refund timelines. Ground-specific rules may apply.</p>
          <p><strong>Platform Scope:</strong> Only full-size outdoor cricket grounds (55m+ boundary) may be listed. OpenGround reserves the right to remove listings that do not meet this standard.</p>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="text-gray-600 space-y-4 text-sm">
          <p>We collect your name, email, phone, and booking data to facilitate ground bookings. We do not sell your data to third parties.</p>
          <p>Booking data is retained for legal and support purposes. You may request deletion by contacting us.</p>
          <p>Payment data is handled by the selected payment gateway and is not stored on OpenGround servers.</p>
        </div>
      </div>
    </div>
  );
}

export function CancellationPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cancellation Policy</h1>
        <div className="text-gray-600 space-y-4 text-sm">
          <p><strong>More than 48 hours before session:</strong> Full refund.</p>
          <p><strong>24–48 hours before session:</strong> 50% refund.</p>
          <p><strong>Less than 24 hours before session:</strong> No refund.</p>
          <p>Pay-at-Ground bookings can be cancelled up to 24 hours before the session at no penalty.</p>
          <p>Ground owners may have additional specific cancellation rules which are displayed on the ground detail page.</p>
        </div>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-bold text-forest-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
