import { useState, useEffect } from 'react';
import { getMessages, sendMessage } from '../../services/api';
import { MessageSquare, Send, Bot, User } from 'lucide-react';

const KNOWLEDGE_BASE = [
  {
    keywords: ['admission', 'apply', 'enroll', 'register', 'application'],
    response: 'Admissions for EduPortal Max 2026-2027 are now open! Visit the Colleges page to browse available programs and click "Apply" to start your journey.'
  },
  {
    keywords: ['document', 'upload', 'certificate', 'id', 'photo'],
    response: 'To complete your profile, please upload: Academic certificates, Citizenship/ID, and a Passport photo via the "Upload Documents" section in your portal.'
  },
  {
    keywords: ['fee', 'pay', 'cost', 'price', 'khalti', 'esewa', 'bank'],
    response: 'Tuition fees vary by program and can be found on individual course pages. We accept secure payments via eSewa, Khalti, or Bank Transfer.'
  },
  {
    keywords: ['status', 'track', 'progress', 'where'],
    response: 'You can track the real-time status of your application in the "Application Status" section of your student dashboard.'
  },
  {
    keywords: ['scholarship', 'financial aid', 'merit', 'discount'],
    response: 'Merit-based scholarships are available for outstanding students (GPA 3.5+). Please reach out to our admin team for detailed criteria and availability.'
  },
  {
    keywords: ['deadline', 'time', 'when', 'last date', 'close'],
    response: 'Application deadlines vary by college. Please check the specific college or course detail page to ensure you apply before the deadline!'
  },
];

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('chat'); // chat | chatbot
  const [chatbotMessages, setChatbotMessages] = useState([
    { role: 'bot', text: 'Hello! I can help with questions about admissions, documents, fees, status, scholarships, and deadlines. What would you like to know?' }
  ]);
  const [botInput, setBotInput] = useState('');

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    getMessages().then(r => setMessages(r.data.data || [])).catch(() => {});
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setLoading(true);
    try {
      await sendMessage({ message: newMsg, receiver_role: 'admin' });
      setNewMsg('');
      getMessages().then(r => setMessages(r.data.data || []));
    } catch {} finally { setLoading(false); }
  };

  const handleBot = (e) => {
    e.preventDefault();
    if (!botInput.trim()) return;
    const userMsg = botInput.toLowerCase();
    setChatbotMessages(prev => [...prev, { role: 'user', text: botInput }]);
    setBotInput('');
    setIsTyping(true);

    const match = KNOWLEDGE_BASE.find(kb => 
      kb.keywords.some(kw => userMsg.includes(kw))
    );

    setTimeout(() => {
      setIsTyping(false);
      setChatbotMessages(prev => [...prev, {
        role: 'bot',
        text: match ? match.response : "I'm still learning! Could you try asking about admissions, documents, fees, application status, scholarships, or deadlines? If you need personalized help, please message the admin securely."
      }]);
    }, 1200 + Math.random() * 800); // 1-2s delay for "typing"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-blue-600" />Messages</h1>
        <p className="text-gray-500">Chat with admin or ask our chatbot</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('chat')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${tab === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Admin Chat
        </button>
        <button onClick={() => setTab('chatbot')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${tab === 'chatbot' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          <Bot className="h-4 w-4 inline mr-1" />FAQ Chatbot
        </button>
      </div>

      {tab === 'chat' ? (
        <div className="card flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No messages yet. Start a conversation!</p>
            ) : (
              messages.map(m => (
                <div key={m.message_id} className={`flex ${m.sender_role === 'student' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${m.sender_role === 'student' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                    <p>{m.message}</p>
                    <p className={`text-xs mt-1 ${m.sender_role === 'student' ? 'text-blue-200' : 'text-gray-400'}`}>
                      {new Date(m.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message..." className="input-field flex-1" />
            <button type="submit" disabled={loading} className="btn-primary px-4"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      ) : (
        <div className="card flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatbotMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-[70%]`}>
                  {m.role === 'bot' && <Bot className="h-6 w-6 text-indigo-500 mt-1 flex-shrink-0" />}
                  <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-indigo-50 text-gray-800 rounded-bl-none'}`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[70%]">
                  <Bot className="h-6 w-6 text-indigo-500 mt-1 flex-shrink-0" />
                  <div className="p-3 rounded-2xl bg-indigo-50 text-gray-800 rounded-bl-none flex gap-1 items-center h-10 w-16">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleBot} className="p-4 border-t flex gap-2">
            <input value={botInput} onChange={e => setBotInput(e.target.value)} placeholder="Ask about admission, fees, documents..." className="input-field flex-1" />
            <button type="submit" className="btn-primary px-4"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      )}
    </div>
  );
}
