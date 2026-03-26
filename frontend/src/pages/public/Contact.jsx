import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative text-white py-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80" alt="Contact Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10 w-full">
          <h1 className="text-3xl font-bold mb-3">Contact Us</h1>
          <p className="text-blue-100">We'd love to hear from you. Send us a message!</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            {[
              { icon: MapPin, title: 'Address', detail: 'Kathmandu, Nepal' },
              { icon: Mail, title: 'Email', detail: 'info@eduportalmax.com' },
              { icon: Phone, title: 'Phone', detail: '+977-01-4567890' },
              { icon: Clock, title: 'Working Hours', detail: 'Sun - Fri: 10AM - 5PM' },
            ].map((item, i) => (
              <div key={i} className="card p-5 flex items-start gap-4">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-2">
            <div className="card p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h2>
              {sent && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4">Message sent successfully!</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="input-field" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="input-field" placeholder="Write your message..." />
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
