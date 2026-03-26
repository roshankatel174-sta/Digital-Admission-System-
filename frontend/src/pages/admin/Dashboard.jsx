import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import { Users, FileText, CheckCircle, Clock, XCircle, Building2, BookOpen, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  const stats = [
    { label: 'Total Applications', value: data?.totalApps || 0, icon: FileText, color: 'from-blue-500 to-indigo-600 shadow-indigo-500/40' },
    { label: 'Approved', value: data?.approved || 0, icon: CheckCircle, color: 'from-emerald-400 to-cyan-500 shadow-emerald-500/40' },
    { label: 'Pending', value: data?.pending || 0, icon: Clock, color: 'from-amber-400 to-orange-500 shadow-orange-500/40' },
    { label: 'Rejected', value: data?.rejected || 0, icon: XCircle, color: 'from-rose-500 to-red-600 shadow-rose-500/40' },
    { label: 'Students', value: data?.totalStudents || 0, icon: Users, color: 'from-purple-500 to-fuchsia-600 shadow-purple-500/40' },
    { label: 'Colleges', value: data?.totalColleges || 0, icon: Building2, color: 'from-cyan-400 to-blue-500 shadow-cyan-500/40' },
    { label: 'Courses', value: data?.totalCourses || 0, icon: BookOpen, color: 'from-teal-400 to-emerald-500 shadow-teal-500/40' },
    { label: 'Revenue', value: `Rs. ${Number(data?.totalPayments || 0).toLocaleString()}`, icon: CreditCard, color: 'from-pink-500 to-rose-500 shadow-pink-500/40' },
  ];

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyChartData = months.map((name, i) => {
    const found = (data?.monthlyData || []).find(d => d.month === i + 1);
    return { name, count: found?.count || 0 };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of the admission system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
              <div className={`h-12 w-12 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Monthly Applications (2026)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="url(#colorIncome)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Application Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data?.statusDistribution || []} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {(data?.statusDistribution || []).map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* College-wise & Course-wise */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">College-wise Applications</h2>
          {(data?.collegeWise || []).length === 0 ? (
            <p className="text-gray-400 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-3">
              {(data?.collegeWise || []).map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1">{c.college_name}</span>
                  <div className="flex items-center gap-2 ml-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((c.count / (data?.totalApps || 1)) * 100, 100)}%` }} /></div>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{c.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Course-wise Applications</h2>
          {(data?.courseWise || []).length === 0 ? (
            <p className="text-gray-400 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-3">
              {(data?.courseWise || []).map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1">{c.course_name}</span>
                  <div className="flex items-center gap-2 ml-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min((c.count / (data?.totalApps || 1)) * 100, 100)}%` }} /></div>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{c.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
