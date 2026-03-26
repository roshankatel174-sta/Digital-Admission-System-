import { useState, useEffect } from 'react';
import { getMyApplications } from '../../services/api';
import { ClipboardCheck, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';

export default function ApplicationStatus() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications().then(r => { setApps(r.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusConfig = {
    Approved: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    Rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    Pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ClipboardCheck className="h-6 w-6 text-blue-600" />Application Status</h1>
        <p className="text-gray-500">Track the progress of your applications</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : apps.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">No applications to track</div>
      ) : (
        <div className="space-y-4">
          {apps.map(app => {
            const config = statusConfig[app.status] || statusConfig.Pending;
            const Icon = config.icon;
            return (
              <div key={app.application_id} className={`card p-6 border-l-4 ${config.border}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{app.course_name}</h3>
                      <p className="text-sm text-gray-500">{app.college_name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>Applied: {new Date(app.application_date).toLocaleDateString()}</span>
                        <span>Payment: <span className={app.payment_status === 'Paid' ? 'text-green-600' : 'text-amber-600'}>{app.payment_status}</span></span>
                      </div>
                    </div>
                  </div>
                  <span className={`badge badge-${app.status?.toLowerCase()} text-sm`}>{app.status}</span>
                </div>

                {/* Progress Timeline */}
                <div className="mt-4 flex items-center gap-2">
                  {['Applied', 'Under Review', app.status === 'Approved' ? 'Approved' : app.status === 'Rejected' ? 'Rejected' : 'Decision'].map((step, i) => {
                    const completed = app.status === 'Approved' ? true : app.status === 'Rejected' ? i < 3 : i === 0;
                    return (
                      <div key={i} className="flex items-center gap-2 flex-1">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${completed ? 'bg-green-500 text-white' : i === 2 && app.status === 'Rejected' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                          {completed ? '✓' : i + 1}
                        </div>
                        <span className="text-xs text-gray-500 hidden sm:block">{step}</span>
                        {i < 2 && <div className={`flex-1 h-0.5 ${completed ? 'bg-green-500' : 'bg-gray-200'}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
