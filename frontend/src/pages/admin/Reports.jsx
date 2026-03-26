import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getDashboardStats().then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly = months.map((name, i) => ({ name, count: (data?.monthlyData || []).find(d => d.month === i + 1)?.count || 0 }));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><BarChart3 className="h-6 w-6 text-blue-600" />Reports & Analytics</h1><p className="text-gray-500">Comprehensive system analytics</p></div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: data?.totalApps || 0, color: 'bg-blue-500' },
          { label: 'Approved', value: data?.approved || 0, color: 'bg-green-500' },
          { label: 'Pending', value: data?.pending || 0, color: 'bg-amber-500' },
          { label: 'Total Revenue', value: `Rs. ${Number(data?.totalPayments || 0).toLocaleString()}`, color: 'bg-purple-500' },
        ].map((s, i) => (
          <div key={i} className="card p-5">
            <div className={`h-2 w-12 ${s.color} rounded-full mb-3`} />
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Monthly Applications Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={data?.statusDistribution || []} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>{(data?.statusDistribution || []).map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">College-wise Applications</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.collegeWise || []} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="college_name" width={150} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Course-wise Applications</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.courseWise || []} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="course_name" width={150} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
