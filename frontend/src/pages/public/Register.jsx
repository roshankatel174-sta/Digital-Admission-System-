import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register as registerApi } from '../../services/api';
import { Zap, User, Mail, Lock, Phone, MapPin, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await registerApi(form);
      loginUser(res.data.token, res.data.user);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[url('/login_campus_bg.png')] bg-cover bg-center bg-no-repeat bg-fixed py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-blue-900/70 to-emerald-900/80 backdrop-blur-sm mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 via-transparent to-cyan-500/30" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl mb-4 shadow-lg shadow-rose-500/30">
            <Zap className="h-8 w-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Create Account</h1>
          <p className="text-blue-100 font-medium mt-1 drop-shadow">Start your admission journey</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          {error && <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-4 text-sm backdrop-blur-md">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-1 drop-shadow">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200" />
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all" placeholder="Your full name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1 drop-shadow">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200" />
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all" placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1 drop-shadow">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200" />
                <input required type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full pl-10 pr-12 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1 drop-shadow">Phone (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200" />
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all" placeholder="98XXXXXXXX" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1 drop-shadow">Address (optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200" />
                <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all" placeholder="City, Country" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-4 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-400 hover:via-orange-400 hover:to-amber-400 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-rose-500/30 transition-all border border-rose-400/50 flex justify-center items-center gap-2">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-300">
            <p>Already have an account? <Link to="/login" className="text-amber-300 font-bold hover:text-white transition-colors">Login Here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
