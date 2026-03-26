import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, getColleges } from '../../services/api';
import { BookOpen, Clock, Users, Building2, Search, DollarSign } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getColleges().then(r => setColleges(r.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getCourses({ search, college_id: collegeFilter || undefined }).then(r => { setCourses(r.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, [search, collegeFilter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative text-white py-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80" alt="Courses Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10 w-full">
          <h1 className="text-3xl font-bold mb-3">Explore Courses</h1>
          <p className="text-blue-100 mb-6">Find the right program that matches your career goals</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mt-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className="w-full bg-white pl-11 pr-4 py-3 rounded-xl text-gray-800 outline-none shadow-lg focus:ring-2 focus:ring-blue-400 transition-all font-medium placeholder:text-gray-400" />
            </div>
            <select value={collegeFilter} onChange={e => setCollegeFilter(e.target.value)} className="bg-white px-4 py-3 rounded-xl text-gray-800 outline-none shadow-lg appearance-none focus:ring-2 focus:ring-blue-400 font-medium cursor-pointer min-w-[200px]">
              <option value="">All Colleges</option>
              {colleges.map(c => <option key={c.college_id} value={c.college_id}>{c.college_name}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="text-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No courses found</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <Link to={`/courses/${course.course_id}`} key={course.course_id} className="card p-6 hover:-translate-y-1">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{course.course_name}</h3>
                  <p className="text-sm text-gray-500 mb-3 flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{course.college_name}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.seats} seats</span>
                    </div>
                    <span className="font-bold text-blue-600">Rs. {Number(course.fee).toLocaleString()}</span>
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
