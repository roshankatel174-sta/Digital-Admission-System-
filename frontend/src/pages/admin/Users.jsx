import { useState, useEffect } from 'react';
import { getAllStudents, deleteStudent, createAdmin } from '../../services/api';
import { UserCog, Plus, Trash2, X } from 'lucide-react';

export default function Users() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });

  const load = () => { setLoading(true); getAllStudents().then(r => { setStudents(r.data.data || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(load, []);

  const handleDelete = async (id) => { if (confirm('Delete this student?')) { await deleteStudent(id); load(); } };
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try { await createAdmin(adminForm); alert('Admin created!'); setShowAddAdmin(false); setAdminForm({ name: '', email: '', password: '' }); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><UserCog className="h-6 w-6 text-blue-600" />Users</h1><p className="text-gray-500">Manage students and admins</p></div>
        <button onClick={() => setShowAddAdmin(true)} className="btn-primary flex items-center gap-2"><Plus className="h-4 w-4" />Add Admin</button>
      </div>

      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Add Admin</h2><button onClick={() => setShowAddAdmin(false)}><X className="h-5 w-5" /></button></div>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input required value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input required type="email" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input required type="password" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className="input-field" /></div>
              <div className="flex gap-3"><button type="submit" className="btn-primary">Create Admin</button><button type="button" onClick={() => setShowAddAdmin(false)} className="btn-secondary">Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="p-4 border-b bg-gray-50"><h3 className="font-semibold text-gray-700">Students ({students.length})</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Phone</th><th className="px-6 py-4">Joined</th><th className="px-6 py-4">Actions</th></tr></thead>
              <tbody className="divide-y">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{s.name}</td>
                    <td className="px-6 py-4 text-gray-500">{s.email}</td>
                    <td className="px-6 py-4">{s.phone || '-'}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4 text-red-600" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {students.length === 0 && <p className="text-center text-gray-400 py-8">No students found</p>}
        </div>
      )}
    </div>
  );
}
