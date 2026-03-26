import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudentDashboard } from '../../services/api';
import { FileText, CheckCircle, Clock, Upload, CreditCard, Bell, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDashboard().then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  const stats = [
    { label: 'Total Applications', value: data?.myApps || 0, icon: FileText, color: 'from-blue-500 to-indigo-600 shadow-indigo-500/40' },
    { label: 'Approved', value: data?.myApproved || 0, icon: CheckCircle, color: 'from-emerald-400 to-cyan-500 shadow-emerald-500/40' },
    { label: 'Pending', value: data?.myPending || 0, icon: Clock, color: 'from-amber-400 to-orange-500 shadow-orange-500/40' },
    { label: 'Documents', value: data?.myDocs || 0, icon: Upload, color: 'from-purple-500 to-pink-500 shadow-purple-500/40' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's your admission overview.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              </div>
              <div className={`h-12 w-12 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions + Payment Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/student/apply" className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-all">
              <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">New Application</span>
            </Link>
            <Link to="/student/documents" className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-all">
              <Upload className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Upload Documents</span>
            </Link>
            <Link to="/student/payments" className="p-4 bg-emerald-50 rounded-xl text-center hover:bg-emerald-100 transition-all">
              <CreditCard className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Make Payment</span>
            </Link>
            <Link to="/student/status" className="p-4 bg-amber-50 rounded-xl text-center hover:bg-amber-100 transition-all">
              <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Track Status</span>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Payment Summary</h2>
          <div className="p-4 bg-gradient-to-r from-rose-500 via-purple-600 to-blue-600 rounded-2xl text-white shadow-lg shadow-purple-500/20">
            <p className="text-sm text-blue-100 font-medium tracking-wide">Total Paid</p>
            <p className="text-4xl font-black mt-1 drop-shadow-md">Rs. {Number(data?.myPayments || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-900">Recent Applications</h2>
          <Link to="/student/applications" className="text-sm text-blue-600 font-medium flex items-center gap-1">View All <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {(data?.recentApps || []).length === 0 ? (
          <p className="text-center text-gray-400 py-8">No applications yet. <Link to="/student/apply" className="text-blue-600">Apply now</Link></p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-gray-500"><th className="pb-3">Course</th><th className="pb-3">College</th><th className="pb-3">Date</th><th className="pb-3">Status</th></tr></thead>
              <tbody>
                {data.recentApps.map(app => (
                  <tr key={app.application_id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-gray-900">{app.course_name}</td>
                    <td className="py-3 text-gray-500">{app.college_name}</td>
                    <td className="py-3 text-gray-500">{new Date(app.application_date).toLocaleDateString()}</td>
                    <td className="py-3"><span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notifications */}
      {(data?.notifications || []).length > 0 && (
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-blue-500" />Recent Notifications</h2>
          <div className="space-y-3">
            {data.notifications.map(n => (
              <div key={n.notification_id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Bell className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">{n.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
