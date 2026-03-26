import { useState, useEffect } from 'react';
import { getMyApplications } from '../../services/api';
import { Link } from 'react-router-dom';
import { FileText, Eye } from 'lucide-react';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications().then(r => { setApps(r.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500">Track all your admission applications</p>
        </div>
        <Link to="/student/apply" className="btn-primary">New Application</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : apps.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-500 mb-4">Start your admission journey by applying to a course</p>
          <Link to="/student/apply" className="btn-primary inline-block">Apply Now</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Course</th>
                  <th className="px-6 py-4 font-medium">College</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {apps.map(app => (
                  <tr key={app.application_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">#{app.application_id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{app.course_name}</td>
                    <td className="px-6 py-4 text-gray-500">{app.college_name}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(app.application_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className={`badge ${app.payment_status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>{app.payment_status}</span></td>
                    <td className="px-6 py-4"><span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
