import { useState, useEffect } from 'react';
import { getApplications, updateApplicationStatus } from '../../services/api';
import { Users, Search, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function Applicants() {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const load = () => {
    setLoading(true);
    getApplications({ status: statusFilter || undefined }).then(r => { setApps(r.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, [statusFilter]);

  const filtered = apps.filter(a =>
    (a.student_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.student_email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = async (id, status) => {
    const remarks = prompt(`Enter remarks for ${status}:`) || '';
    await updateApplicationStatus(id, { status, remarks });
    load();
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Users className="h-6 w-6 text-blue-600" />Applicants</h1>
        <p className="text-gray-500">Manage student applications</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="input-field pl-10" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Apps Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Application Details</h2>
            <div className="space-y-3 text-sm">
              <div><strong>Student:</strong> {selectedApp.student_name} ({selectedApp.student_email})</div>
              <div><strong>Course:</strong> {selectedApp.course_name}</div>
              <div><strong>College:</strong> {selectedApp.college_name}</div>
              <div><strong>Date:</strong> {new Date(selectedApp.application_date).toLocaleDateString()}</div>
              <div><strong>Status:</strong> <span className={`badge badge-${selectedApp.status?.toLowerCase()}`}>{selectedApp.status}</span></div>
              <div><strong>Payment:</strong> <span className={`badge ${selectedApp.payment_status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>{selectedApp.payment_status}</span></div>
              {selectedApp.personal_info && (
                <div><strong>Personal Info:</strong><pre className="bg-gray-50 p-2 rounded text-xs mt-1">{typeof selectedApp.personal_info === 'string' ? selectedApp.personal_info : JSON.stringify(selectedApp.personal_info, null, 2)}</pre></div>
              )}
              {selectedApp.academic_info && (
                <div><strong>Academic Info:</strong><pre className="bg-gray-50 p-2 rounded text-xs mt-1">{typeof selectedApp.academic_info === 'string' ? selectedApp.academic_info : JSON.stringify(selectedApp.academic_info, null, 2)}</pre></div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              {selectedApp.status === 'Pending' && (
                <>
                  <button onClick={() => handleAction(selectedApp.application_id, 'Approved')} className="btn-success flex items-center gap-1"><CheckCircle className="h-4 w-4" />Approve</button>
                  <button onClick={() => handleAction(selectedApp.application_id, 'Rejected')} className="btn-danger flex items-center gap-1"><XCircle className="h-4 w-4" />Reject</button>
                </>
              )}
              <button onClick={() => setSelectedApp(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr className="text-left text-gray-500">
                <th className="px-6 py-4">Student</th><th className="px-6 py-4">Course</th><th className="px-6 py-4">College</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Payment</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Actions</th>
              </tr></thead>
              <tbody className="divide-y">
                {filtered.map(app => (
                  <tr key={app.application_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><p className="font-medium text-gray-900">{app.student_name}</p><p className="text-xs text-gray-400">{app.student_email}</p></td>
                    <td className="px-6 py-4">{app.course_name}</td>
                    <td className="px-6 py-4 text-gray-500">{app.college_name}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(app.application_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className={`badge ${app.payment_status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>{app.payment_status}</span></td>
                    <td className="px-6 py-4"><span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedApp(app)} className="p-1.5 hover:bg-blue-50 rounded-lg" title="View"><Eye className="h-4 w-4 text-blue-600" /></button>
                        {app.status === 'Pending' && (
                          <>
                            <button onClick={() => handleAction(app.application_id, 'Approved')} className="p-1.5 hover:bg-green-50 rounded-lg" title="Approve"><CheckCircle className="h-4 w-4 text-green-600" /></button>
                            <button onClick={() => handleAction(app.application_id, 'Rejected')} className="p-1.5 hover:bg-red-50 rounded-lg" title="Reject"><XCircle className="h-4 w-4 text-red-600" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No applicants found</p>}
        </div>
      )}
    </div>
  );
}
