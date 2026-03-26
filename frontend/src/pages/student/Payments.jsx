import { useState, useEffect } from 'react';
import { getMyPayments, getMyApplications, createPayment } from '../../services/api';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [apps, setApps] = useState([]);
  const [showPay, setShowPay] = useState(false);
  const [selectedApp, setSelectedApp] = useState('');
  const [method, setMethod] = useState('eSewa');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    getMyPayments().then(r => setPayments(r.data.data || [])).catch(() => {});
    getMyApplications().then(r => setApps((r.data.data || []).filter(a => a.payment_status === 'Unpaid'))).catch(() => {});
  };
  useEffect(load, []);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    const app = apps.find(a => a.application_id === Number(selectedApp));
    try {
      await createPayment({ application_id: Number(selectedApp), amount: app.fee, payment_method: method });
      setSuccess('Payment successful!');
      setShowPay(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><CreditCard className="h-6 w-6 text-blue-600" />Payments</h1>
          <p className="text-gray-500">Manage your admission fee payments</p>
        </div>
        {apps.length > 0 && <button onClick={() => setShowPay(true)} className="btn-primary">Make Payment</button>}
      </div>

      {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-2"><CheckCircle className="h-5 w-5" />{success}</div>}

      {/* Payment Form Modal */}
      {showPay && (
        <div className="card p-6 border-2 border-blue-200">
          <h2 className="font-bold text-gray-900 mb-4">Make Payment</h2>
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> This is a mock payment flow. In production, this would integrate with eSewa/Khalti.
          </p>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Application</label>
              <select required value={selectedApp} onChange={e => setSelectedApp(e.target.value)} className="input-field">
                <option value="">Choose application...</option>
                {apps.map(a => <option key={a.application_id} value={a.application_id}>{a.course_name} - {a.college_name} (Rs. {Number(a.fee).toLocaleString()})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select value={method} onChange={e => setMethod(e.target.value)} className="input-field">
                <option>eSewa</option><option>Khalti</option><option>Bank Transfer</option><option>Cash</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Processing...' : 'Confirm Payment'}</button>
              <button type="button" onClick={() => setShowPay(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Payment History */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 mb-4">Payment History</h2>
        {payments.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No payments made yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-4 py-3">ID</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr></thead>
              <tbody className="divide-y">
                {payments.map(p => (
                  <tr key={p.payment_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">#{p.payment_id}</td>
                    <td className="px-4 py-3 font-medium">{p.course_name}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">Rs. {Number(p.amount).toLocaleString()}</td>
                    <td className="px-4 py-3">{p.payment_method}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(p.transaction_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className="badge badge-approved">{p.payment_status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
