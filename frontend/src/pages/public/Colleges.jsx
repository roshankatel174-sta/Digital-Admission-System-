import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getColleges } from '../../services/api';
import { Building2, MapPin, Mail, Phone, Search, ArrowRight } from 'lucide-react';

export default function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [province, setProvince] = useState('');
  const [loading, setLoading] = useState(true);

  const PROVINCES = ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];

  useEffect(() => {
    setLoading(true);
    getColleges({ search, location, province }).then(r => { setColleges(r.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, [search, location, province]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="relative text-white py-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80" alt="Colleges Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10 w-full">
          <h1 className="text-3xl font-bold mb-3">Explore Colleges</h1>
          <p className="text-blue-100 mb-6">Find the perfect institution for your academic journey</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-4xl mx-auto mt-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search colleges..." className="w-full bg-white pl-11 pr-4 py-3 rounded-xl text-gray-800 outline-none shadow-lg focus:ring-2 focus:ring-blue-400 transition-all font-medium placeholder:text-gray-400" />
            </div>
            <div className="w-full sm:w-48 relative group">
              <select value={province} onChange={e => setProvince(e.target.value)} className="w-full bg-white px-4 py-3 rounded-xl text-gray-800 outline-none shadow-lg appearance-none focus:ring-2 focus:ring-blue-400 font-medium cursor-pointer">
                <option value="">All Provinces</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p} Province</option>)}
              </select>
            </div>
            <div className="w-full sm:w-48 relative">
              <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City / Area..." className="w-full bg-white pl-11 pr-4 py-3 rounded-xl text-gray-800 outline-none shadow-lg focus:ring-2 focus:ring-blue-400 transition-all font-medium placeholder:text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* College Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="text-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No colleges found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {colleges.map(col => (
                <Link to={`/colleges/${col.college_id}`} key={col.college_id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col hover:-translate-y-1">
                  
                  {/* Image full width */}
                  <div className="h-56 bg-gray-200 relative overflow-hidden">
                    <img 
                      src={col.image 
                        ? `http://localhost:5000/uploads/${col.image}` 
                        : [
                            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1562774053-7019fdb332f4?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80"
                          ][(col.college_id || 0) % 5]
                      } 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80";
                      }}
                      alt={col.college_name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                    
                    {/* Badges on Img */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${col.status === 'active' ? 'bg-green-500/20 text-green-100 border border-green-400/30' : 'bg-red-500/20 text-red-100 border border-red-400/30'}`}>
                        {col.status === 'active' ? 'Admissions Open' : 'Closed'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg shadow-blue-500/30 uppercase tracking-wide">
                        {col.province}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{col.college_name}</h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-medium">
                      <MapPin className="h-4 w-4 text-blue-500" /> {col.location}
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                      {col.description}
                    </p>
                    
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium border border-gray-100 bg-gray-50 px-3 py-1.5 rounded-lg truncate max-w-[70%]">
                        {col.contact_email ? <span className="flex items-center gap-1.5 truncate"><Mail className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" /><span className="truncate">{col.contact_email}</span></span> : <span>No Email</span>}
                      </div>
                      <div className="h-8 w-8 bg-blue-50 rounded-full flex flex-shrink-0 items-center justify-center group-hover:bg-blue-600 transition-colors">
                         <ArrowRight className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
