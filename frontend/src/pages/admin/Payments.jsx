import { useState, useEffect } from 'react';
import { getAllPayments } from '../../services/api';
import { CreditCard } from 'lucide-react';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getAllPayments().then(r => { setPayments(r.data.data || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const total = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><CreditCard className="h-6 w-6 text-blue-600" />Payments</h1><p className="text-gray-500">Monitor all payment transactions</p></div>
        <div className="card p-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white"><p className="text-xs">Total Revenue</p><p className="text-xl font-bold">Rs. {total.toLocaleString()}</p></div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-6 py-4">ID</th><th className="px-6 py-4">Student</th><th className="px-6 py-4">Course</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Method</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Status</th></tr></thead>
              <tbody className="divide-y">
                {payments.map(p => (
                  <tr key={p.payment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">#{p.payment_id}</td>
                    <td className="px-6 py-4 font-medium">{p.student_name}</td>
                    <td className="px-6 py-4">{p.course_name}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">Rs. {Number(p.amount).toLocaleString()}</td>
                    <td className="px-6 py-4">{p.payment_method}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(p.transaction_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className="badge badge-approved">{p.payment_status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {payments.length === 0 && <p className="text-center text-gray-400 py-8">No payments found</p>}
        </div>
      )}
    </div>
  );
}
