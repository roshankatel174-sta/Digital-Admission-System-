import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/api';
import { User, Mail, Phone, MapPin, Save, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile().then(r => {
      const u = r.data.user;
      setForm({ name: u.name, email: u.email, phone: u.phone || '', address: u.address || '' });
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await updateProfile(form);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><User className="h-6 w-6 text-blue-600" />My Profile</h1>
        <p className="text-gray-500">Manage your account information</p>
      </div>

      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
            {form.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{form.name}</h2>
            <p className="text-gray-500">{form.email}</p>
            <span className="badge bg-blue-100 text-blue-700 mt-1">Student</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">Edit Profile</h3>
        {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4" />{success}</div>}
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (read-only)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input value={form.email} readOnly className="input-field pl-10 bg-gray-50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field pl-10" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
