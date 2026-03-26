import { useState, useEffect } from 'react';
import { getAllDocuments, verifyDocument } from '../../services/api';
import { FileCheck, CheckCircle, XCircle, Clock, FileText, Image as ImageIcon } from 'lucide-react';

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); getAllDocuments().then(r => { setDocs(r.data.data || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(load, []);

  const handleVerify = async (id, status) => {
    await verifyDocument(id, { verification_status: status });
    load();
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileCheck className="h-6 w-6 text-blue-600" />Documents</h1><p className="text-gray-500">Verify uploaded student documents</p></div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-6 py-4">Student</th><th className="px-6 py-4">File</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Actions</th></tr></thead>
              <tbody className="divide-y">
                {docs.map(doc => (
                  <tr key={doc.document_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><p className="font-medium">{doc.student_name}</p><p className="text-xs text-gray-400">{doc.student_email}</p></td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {doc.file_name?.match(/\.(jpg|jpeg|png)$/i) ? <ImageIcon className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-blue-500" />}
                      <span className="truncate max-w-[150px]">{doc.file_name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{doc.file_type?.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(doc.upload_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className={`badge ${doc.verification_status === 'Verified' ? 'badge-approved' : doc.verification_status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}`}>{doc.verification_status}</span></td>
                    <td className="px-6 py-4">
                      {doc.verification_status === 'Pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleVerify(doc.document_id, 'Verified')} className="p-1.5 hover:bg-green-50 rounded-lg" title="Verify"><CheckCircle className="h-4 w-4 text-green-600" /></button>
                          <button onClick={() => handleVerify(doc.document_id, 'Rejected')} className="p-1.5 hover:bg-red-50 rounded-lg" title="Reject"><XCircle className="h-4 w-4 text-red-600" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {docs.length === 0 && <p className="text-center text-gray-400 py-8">No documents found</p>}
        </div>
      )}
    </div>
  );
}
