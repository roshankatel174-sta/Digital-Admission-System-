import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../services/api';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(form);
      loginUser(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[url('/login_campus_bg.png')] bg-cover bg-center bg-no-repeat bg-fixed py-12 px-4">
      {/* 4+ Color Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-blue-900/70 to-emerald-900/80 backdrop-blur-sm mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 via-transparent to-cyan-500/30" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl mb-4 shadow-lg shadow-rose-500/30">
            <Zap className="h-8 w-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Welcome Back</h1>
          <p className="text-blue-100 font-medium mt-1 drop-shadow">Login to your EduPortal Max account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

          {/* Role Selection */}
          <div className="flex bg-black/20 p-1 rounded-2xl mb-8 border border-white/10 shadow-inner">
            <button 
              type="button" 
              onClick={() => { setForm({...form, role: 'student'}); setError(''); }} 
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${form.role === 'student' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30' : 'text-gray-300 hover:text-white'}`}
            >
              Student Portal
            </button>
            <button 
              type="button" 
              onClick={() => { setForm({...form, role: 'admin'}); setError(''); }} 
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${form.role === 'admin' ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30' : 'text-gray-300 hover:text-white'}`}
            >
              Admin Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white mb-2 drop-shadow">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200" />
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all" placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2 drop-shadow">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200" />
                <input required type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-500 text-white py-3.5 rounded-xl font-boldshadow-lg shadow-blue-500/30 transition-all border border-blue-400/50 flex justify-center items-center gap-2">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Secure Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-300">
            <p>Don't have an account? <Link to="/register" className="text-cyan-300 font-bold hover:text-white transition-colors">Register</Link></p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium mb-2">Demo Credentials for {form.role === 'student' ? 'Student' : 'Admin'}:</p>
            <div className="text-xs text-blue-500 space-y-1">
              {form.role === 'student' ? (
                <p><strong>Student:</strong> roshan@example.com / student123</p>
              ) : (
                <p><strong>Admin:</strong> admin@eduportalmax.com / admin123</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
