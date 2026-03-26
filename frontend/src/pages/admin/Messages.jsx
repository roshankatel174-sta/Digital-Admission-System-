import { useState, useEffect } from 'react';
import { getMessages, replyMessage } from '../../services/api';
import { MessageSquare, Send } from 'lucide-react';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { getMessages().then(r => { setMessages(r.data.data || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      await replyMessage({ message: reply, receiver_role: 'student' });
      setReply('');
      getMessages().then(r => setMessages(r.data.data || []));
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-blue-600" />Messages</h1><p className="text-gray-500">Student inquiries and replies</p></div>

      <div className="card flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No messages yet</p>
          ) : (
            messages.map(m => (
              <div key={m.message_id} className={`flex ${m.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${m.sender_role === 'admin' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                  {m.sender_role !== 'admin' && <p className="text-xs font-medium text-blue-600 mb-1">{m.sender_name || 'Student'}</p>}
                  <p>{m.message}</p>
                  <p className={`text-xs mt-1 ${m.sender_role === 'admin' ? 'text-blue-200' : 'text-gray-400'}`}>{new Date(m.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleReply} className="p-4 border-t flex gap-2">
          <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Reply to students..." className="input-field flex-1" />
          <button type="submit" className="btn-primary px-4"><Send className="h-4 w-4" /></button>
        </form>
      </div>
    </div>
  );
}
