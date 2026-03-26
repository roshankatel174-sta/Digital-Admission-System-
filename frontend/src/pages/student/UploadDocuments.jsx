import { useState, useEffect } from 'react';
import { uploadDocument, getMyDocuments } from '../../services/api';
import { Upload, FileText, CheckCircle, Clock, XCircle, Image as ImageIcon } from 'lucide-react';

export default function UploadDocuments() {
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('academic_certificate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadDocs = () => {
    getMyDocuments().then(r => setDocs(r.data.data || [])).catch(() => {});
  };

  useEffect(() => { loadDocs(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a file'); return; }
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('file_type', fileType);
      await uploadDocument(formData);
      setSuccess('Document uploaded successfully!');
      setFile(null);
      loadDocs();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'Verified': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Upload className="h-6 w-6 text-blue-600" />Upload Documents</h1>
        <p className="text-gray-500">Upload your academic certificates and required documents</p>
      </div>

      {/* Upload Form */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 mb-4">Upload New Document</h2>
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <select value={fileType} onChange={e => setFileType(e.target.value)} className="input-field">
                <option value="academic_certificate">Academic Certificate</option>
                <option value="citizenship">Citizenship / ID</option>
                <option value="photo">Passport Photo</option>
                <option value="other">Other Supporting Document</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files[0])} className="input-field" />
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — Max 5MB</p>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Upload className="h-4 w-4" /> Upload</>}
          </button>
        </form>
      </div>

      {/* Document List */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 mb-4">My Documents ({docs.length})</h2>
        {docs.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No documents uploaded yet</p>
        ) : (
          <div className="space-y-3">
            {docs.map(doc => (
              <div key={doc.document_id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {doc.file_name?.match(/\.(jpg|jpeg|png)$/i) ? <ImageIcon className="h-5 w-5 text-blue-600" /> : <FileText className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{doc.file_name}</p>
                    <p className="text-xs text-gray-400">{doc.file_type?.replace('_', ' ')} • {new Date(doc.upload_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {statusIcon(doc.verification_status)}
                  <span className={`badge ${doc.verification_status === 'Verified' ? 'badge-approved' : doc.verification_status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                    {doc.verification_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
