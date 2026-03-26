import { useState, useEffect } from 'react';
import { getCourses, getColleges, createCourse, updateCourse, deleteCourse } from '../../services/api';
import { BookOpen, Plus, Pencil, Trash2, X } from 'lucide-react';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ college_id: '', course_name: '', duration: '', eligibility: '', fee: '', seats: '', description: '', career_opportunities: '', status: 'active' });

  const load = () => { setLoading(true); getCourses().then(r => { setCourses(r.data.data || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { load(); getColleges().then(r => setColleges(r.data.data || [])).catch(() => {}); }, []);

  const resetForm = () => { setForm({ college_id: '', course_name: '', duration: '', eligibility: '', fee: '', seats: '', description: '', career_opportunities: '', status: 'active' }); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await updateCourse(editing, form); } else { await createCourse(form); }
      resetForm(); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (course) => { setForm({ college_id: course.college_id, course_name: course.course_name, duration: course.duration, eligibility: course.eligibility, fee: course.fee, seats: course.seats, description: course.description, career_opportunities: course.career_opportunities, status: course.status }); setEditing(course.course_id); setShowForm(true); };
  const handleDelete = async (id) => { if (confirm('Delete this course?')) { await deleteCourse(id); load(); } };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><BookOpen className="h-6 w-6 text-blue-600" />Manage Courses</h1><p className="text-gray-500">Add, edit, and manage courses</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2"><Plus className="h-4 w-4" />Add Course</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editing ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={resetForm}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">College *</label>
                  <select required value={form.college_id} onChange={e => setForm({...form, college_id: e.target.value})} className="input-field">
                    <option value="">Select College</option>{colleges.map(c => <option key={c.college_id} value={c.college_id}>{c.college_name}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label><input required value={form.course_name} onChange={e => setForm({...form, course_name: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label><input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="input-field" placeholder="e.g., 4 years" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Fee (Rs.)</label><input type="number" value={form.fee} onChange={e => setForm({...form, fee: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Seats</label><input type="number" value={form.seats} onChange={e => setForm({...form, seats: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label><textarea rows={2} value={form.eligibility} onChange={e => setForm({...form, eligibility: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Career Opportunities (comma separated)</label><textarea rows={2} value={form.career_opportunities} onChange={e => setForm({...form, career_opportunities: e.target.value})} className="input-field" /></div>
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
              <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-6 py-4">Course</th><th className="px-6 py-4">College</th><th className="px-6 py-4">Duration</th><th className="px-6 py-4">Fee</th><th className="px-6 py-4">Seats</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Actions</th></tr></thead>
              <tbody className="divide-y">
                {courses.map(c => (
                  <tr key={c.course_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.course_name}</td>
                    <td className="px-6 py-4 text-gray-500">{c.college_name}</td>
                    <td className="px-6 py-4">{c.duration}</td>
                    <td className="px-6 py-4 font-medium">Rs. {Number(c.fee).toLocaleString()}</td>
                    <td className="px-6 py-4">{c.seats}</td>
                    <td className="px-6 py-4"><span className={`badge ${c.status === 'active' ? 'badge-approved' : 'badge-rejected'}`}>{c.status}</span></td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <button onClick={() => handleEdit(c)} className="p-1.5 hover:bg-blue-50 rounded-lg"><Pencil className="h-4 w-4 text-blue-600" /></button>
                      <button onClick={() => handleDelete(c.course_id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4 text-red-600" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {courses.length === 0 && <p className="text-center text-gray-400 py-8">No courses found</p>}
        </div>
      )}
    </div>
  );
}
