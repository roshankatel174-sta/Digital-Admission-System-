import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { getNotifications, markAllNotificationsRead } from '../services/api';
import {
  LayoutDashboard, FileText, FilePlus, Upload, CreditCard, 
  ClipboardCheck, MessageSquare, User, LogOut, Menu, X, Bell, 
  ChevronDown, Home, GraduationCap
} from 'lucide-react';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    getNotifications().then(r => setNotifications(r.data.data || [])).catch(() => {});
  }, [location]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const menuItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/applications', label: 'My Applications', icon: FileText },
    { path: '/student/apply', label: 'Admission Form', icon: FilePlus },
    { path: '/student/documents', label: 'Documents', icon: Upload },
    { path: '/student/payments', label: 'Payments', icon: CreditCard },
    { path: '/student/status', label: 'Status', icon: ClipboardCheck },
    { path: '/student/messages', label: 'Messages', icon: MessageSquare },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 4+ Color Gradient Top Navbar */}
      <header className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-700 shadow-xl shadow-purple-900/10 sticky top-0 z-40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl border border-white/30 shadow-inner group-hover:scale-105 transition-all">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-black text-xl text-white tracking-tight hidden sm:block drop-shadow-md">Student Portal</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-2">
                <Link to="/" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-purple-100 hover:bg-white/15 hover:text-white transition-all">
                  <Home className="h-4 w-4" /> Home
                </Link>
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive ? 'bg-white/20 text-white shadow-inner border border-white/20' : 'text-purple-100 hover:bg-white/15 hover:text-white border border-transparent'}`}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }} className="relative p-2 rounded-xl text-purple-100 hover:bg-white/15 hover:text-white transition-all border border-transparent hover:border-white/20">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-xs font-black rounded-full h-4 w-4 flex items-center justify-center shadow-md">{unreadCount}</span>
                  )}
                </button>
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-blue-100 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-blue-50 flex justify-between bg-blue-50/30">
                      <span className="font-bold text-blue-900 text-sm">Notifications</span>
                      <button onClick={() => { markAllNotificationsRead(); setNotifications(prev => prev.map(n => ({...n, is_read: 1}))); }} className="text-xs font-medium text-blue-600">Mark all read</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-400 text-sm">No new notifications</div>
                      ) : (
                        notifications.slice(0, 10).map(n => (
                          <div key={n.notification_id} className={`p-3 rounded-md text-sm mb-1 ${!n.is_read ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                            <p className="font-medium text-blue-900">{n.title}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative hidden sm:block">
                <button onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }} className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all group">
                  <div className="h-8 w-8 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-105 transition-transform">
                    {user?.name?.charAt(0) || 'S'}
                  </div>
                  <span className="text-sm font-bold text-white tracking-wide">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4 text-purple-200" />
                </button>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-blue-50 bg-blue-50/30">
                      <p className="font-semibold text-sm text-blue-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/student/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"><User className="h-4 w-4" /> Profile</Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md mt-1"><LogOut className="h-4 w-4" /> Sign Out</button>
                    </div>
                  </div>
                )}
              </div>

              <button className="lg:hidden p-2 text-white hover:bg-white/15 rounded-xl border border-transparent hover:border-white/20" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-blue-100 shadow-md fixed w-full z-30 top-16">
          <nav className="p-4 space-y-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600"><Home className="h-5 w-5" /> Home</Link>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                  <Icon className="h-5 w-5" /><span>{item.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-blue-50 pt-2 mt-2">
              <Link to="/student/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600"><User className="h-5 w-5" /> Profile</Link>
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 w-full"><LogOut className="h-5 w-5" /> Sign Out</button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
