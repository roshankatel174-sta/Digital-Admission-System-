import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Menu, X, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getNotifications } from '../services/api';

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (user) {
      getNotifications().then(r => {
        setNotifCount(r.data.data.filter(n => !n.is_read).length);
      }).catch(() => {});
    }
  }, [user]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/colleges', label: 'Colleges' },
    { path: '/courses', label: 'Courses' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-2 rounded-xl shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-all group-hover:scale-105">
                <Zap className="h-6 w-6 text-white fill-white" />
              </div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">EduPortal Max</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} className="text-sm font-medium text-gray-600 hover:text-blue-600">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="btn-primary text-sm">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">Login</Link>
                  <Link to="/register" className="btn-primary text-sm">Register</Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="border-t pt-2 mt-2">
                {user ? (
                  <>
                    <Link to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} className="block px-3 py-2 rounded-lg text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-red-500">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-3 py-2" onClick={() => setMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="block px-3 py-2 text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-2 rounded-xl shadow-lg shadow-rose-500/30">
                  <Zap className="h-5 w-5 text-white fill-white" />
                </div>
                <span className="text-lg font-black text-white tracking-tight">EduPortal Max</span>
              </div>
              <p className="text-sm text-gray-400">Simplifying college admissions with modern technology. Apply, track, and succeed.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/colleges" className="hover:text-white transition-colors">Colleges</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Student Portal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/student/apply" className="hover:text-white transition-colors">Apply Now</Link></li>
                <li><Link to="/student/status" className="hover:text-white transition-colors">Track Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Contact Info</h4>
              <ul className="space-y-2 text-sm">
                <li>📍 Kathmandu, Nepal</li>
                <li>📞 +977-01-4567890</li>
                <li>✉️ info@eduportalmax.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
            © 2026 EduPortal Max. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
