import { useState, useEffect } from 'react';
import { getApplications, updateApplicationStatus } from '../../services/api';
import { FileText, CheckCircle, XCircle, Search } from 'lucide-react';

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => { setLoading(true); getApplications({ status: filter || undefined }).then(r => { setApps(r.data.data || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(load, [filter]);

  const handleAction = async (id, status) => {
    const remarks = prompt(`Remarks for ${status}:`) || '';
    await updateApplicationStatus(id, { status, remarks });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileText className="h-6 w-6 text-blue-600" />Applications</h1><p className="text-gray-500">Manage all applications</p></div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field w-auto"><option value="">All</option><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-6 py-4">ID</th><th className="px-6 py-4">Student</th><th className="px-6 py-4">Course</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Payment</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Actions</th></tr></thead>
              <tbody className="divide-y">
                {apps.map(app => (
                  <tr key={app.application_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">#{app.application_id}</td>
                    <td className="px-6 py-4 font-medium">{app.student_name}</td>
                    <td className="px-6 py-4">{app.course_name}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(app.application_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className={`badge ${app.payment_status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>{app.payment_status}</span></td>
                    <td className="px-6 py-4"><span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span></td>
                    <td className="px-6 py-4">
                      {app.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(app.application_id, 'Approved')} className="p-1.5 hover:bg-green-50 rounded-lg"><CheckCircle className="h-4 w-4 text-green-600" /></button>
                          <button onClick={() => handleAction(app.application_id, 'Rejected')} className="p-1.5 hover:bg-red-50 rounded-lg"><XCircle className="h-4 w-4 text-red-600" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {apps.length === 0 && <p className="text-center text-gray-400 py-8">No applications found</p>}
        </div>
      )}
    </div>
  );
}
