import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { getNotifications, markAllNotificationsRead } from '../services/api';
import {
  LayoutDashboard, Users, Building2, BookOpen, FileText, 
  FileCheck, CreditCard, BarChart3, UserCog, MessageSquare, 
  Settings, LogOut, Menu, X, Bell, Shield, Home
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    getNotifications().then(r => setNotifications(r.data.data || [])).catch(() => {});
  }, [location]);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/applicants', label: 'Applicants', icon: Users },
    { path: '/admin/colleges', label: 'Colleges', icon: Building2 },
    { path: '/admin/courses', label: 'Courses', icon: BookOpen },
    { path: '/admin/applications', label: 'Applications', icon: FileText },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
    { path: '/admin/documents', label: 'Documents', icon: FileCheck },
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { path: '/admin/users', label: 'Users', icon: UserCog },
    { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 text-white w-64 transform transition-transform duration-200 ease-in-out z-30 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-2xl border-r border-white/5`}>
        <div className="h-16 flex items-center px-6 bg-white/5 border-b border-white/10 backdrop-blur-sm">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-1.5 rounded-lg shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">Admin Portal</span>
          </Link>
          <button className="ml-auto lg:hidden text-gray-400 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all">
            <Home className="h-5 w-5 text-emerald-400" /> Home Page
          </Link>
          
          <div className="pt-2 pb-1">
            <p className="px-3 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 uppercase tracking-widest">Management</p>
          </div>
          
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/30' : 'text-gray-300 hover:bg-white/10 hover:hover:text-white'}`}>
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 bg-black/20 border-t border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-[2px]">
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-xs text-indigo-300 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-rose-500 hover:to-orange-500 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-rose-500/30 text-white border border-white/10 hover:border-transparent">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0">
          <button className="lg:hidden p-2 text-gray-500 hover:text-blue-600" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="font-semibold text-gray-800 hidden sm:block">
            EduPortal Max Administration
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="p-3 border-b flex justify-between tracking-wide bg-blue-50">
                    <span className="text-sm font-semibold text-blue-900">Notifications</span>
                    <button onClick={() => { markAllNotificationsRead(); setNotifications(prev => prev.map(n => ({...n, is_read: 1}))); }} className="text-xs text-blue-600 hover:none">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                     {notifications.length === 0 ? (
                       <div className="p-4 text-center text-gray-400 text-sm">No new notifications</div>
                     ) : (
                       notifications.slice(0, 10).map(n => (
                         <div key={n.notification_id} className={`p-2 rounded text-sm ${!n.is_read ? 'bg-blue-50/50' : ''}`}>
                           <p className="font-medium text-gray-800">{n.title}</p>
                           <p className="text-gray-500 text-xs mt-0.5">{n.message}</p>
                         </div>
                       ))
                     )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-blue-50/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
