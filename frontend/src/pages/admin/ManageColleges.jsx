import { useState, useEffect } from 'react';
import { getColleges, createCollege, updateCollege, deleteCollege } from '../../services/api';
import { Building2, Plus, Pencil, Trash2, X } from 'lucide-react';

export default function ManageColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ college_name: '', province: 'Bagmati', location: '', description: '', achievements: '', facilities: '', contact_email: '', contact_phone: '', image: '', status: 'active' });
  const PROVINCES = ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];

  const load = () => { setLoading(true); getColleges().then(r => { setColleges(r.data.data || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(load, []);

  const resetForm = () => { setForm({ college_name: '', province: 'Bagmati', location: '', description: '', achievements: '', facilities: '', contact_email: '', contact_phone: '', image: '', status: 'active' }); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await updateCollege(editing, form); }
      else { await createCollege(form); }
      resetForm(); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (col) => { setForm(col); setEditing(col.college_id); setShowForm(true); };
  const handleDelete = async (id) => { if (confirm('Delete this college?')) { await deleteCollege(id); load(); } };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Building2 className="h-6 w-6 text-blue-600" />Manage Colleges</h1><p className="text-gray-500">Add, edit, and manage colleges</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2"><Plus className="h-4 w-4" />Add College</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editing ? 'Edit College' : 'Add College'}</h2>
              <button onClick={resetForm}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">College Name *</label><input required value={form.college_name} onChange={e => setForm({...form, college_name: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                  <select required value={form.province} onChange={e => setForm({...form, province: e.target.value})} className="input-field">
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Location *</label><input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input value={form.contact_phone} onChange={e => setForm({...form, contact_phone: e.target.value})} className="input-field" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Achievements (comma separated)</label><textarea rows={2} value={form.achievements} onChange={e => setForm({...form, achievements: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Facilities (comma separated)</label><textarea rows={2} value={form.facilities} onChange={e => setForm({...form, facilities: e.target.value})} className="input-field" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field"><option value="active">Active</option><option value="inactive">Inactive</option></select>
                </div>
              </div>
              <div className="flex gap-3"><button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button><button type="button" onClick={resetForm} className="btn-secondary">Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-6 py-4">College</th><th className="px-6 py-4">Province</th><th className="px-6 py-4">Location</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Phone</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Actions</th></tr></thead>
              <tbody className="divide-y">
                {colleges.map(col => (
                  <tr key={col.college_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{col.college_name}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600 uppercase text-xs tracking-wider">{col.province}</td>
                    <td className="px-6 py-4 text-gray-500">{col.location}</td>
                    <td className="px-6 py-4 text-gray-500">{col.contact_email}</td>
                    <td className="px-6 py-4 text-gray-500">{col.contact_phone}</td>
                    <td className="px-6 py-4"><span className={`badge ${col.status === 'active' ? 'badge-approved' : 'badge-rejected'}`}>{col.status}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(col)} className="p-1.5 hover:bg-blue-50 rounded-lg"><Pencil className="h-4 w-4 text-blue-600" /></button>
                        <button onClick={() => handleDelete(col.college_id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4 text-red-600" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {colleges.length === 0 && <p className="text-center text-gray-400 py-8">No colleges found</p>}
        </div>
      )}
    </div>
  );
}
