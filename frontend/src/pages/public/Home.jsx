import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getColleges, getCourses } from '../../services/api';
import { GraduationCap, Building2, BookOpen, Users, Award, CheckCircle, ArrowRight, Star, MapPin, Clock } from 'lucide-react';

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getColleges().then(r => setColleges((r.data.data || []).slice(0, 3))).catch(() => {});
    getCourses().then(r => setCourses((r.data.data || []).slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[url('/hero_campus_bg.png')] bg-cover bg-center bg-no-repeat text-white overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-purple-900/80 to-rose-900/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative w-full pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 backdrop-blur-md rounded-full px-5 py-2.5 text-sm mb-8 shadow-lg shadow-emerald-500/20">
              <Star className="h-4 w-4 text-emerald-300" />
              <span className="font-semibold text-emerald-100 tracking-wide">Admissions Open 2026-2027</span>
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-tight mb-8 tracking-tighter mix-blend-normal">
              <span className="text-white drop-shadow-xl">Maximum Control.</span><br />
              <span className="bg-gradient-to-r from-cyan-300 via-amber-300 to-rose-400 bg-clip-text text-transparent drop-shadow-lg filter brightness-110">Minimum Effort.</span>
            </h1>
            <p className="text-lg sm:text-2xl text-purple-100/90 mb-10 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
              Welcome to EduPortal Max. The most dynamic and powerful platform to browse top colleges, explore courses, and apply online.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link to="/colleges" className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_40px_-5px_rgba(56,189,248,0.5)] flex items-center justify-center gap-3 text-lg border border-cyan-400/30">
                Browse Colleges <ArrowRight className="h-6 w-6" />
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_40px_-5px_rgba(244,63,94,0.5)] flex items-center justify-center gap-3 text-lg border border-rose-400/30">
                Apply Now <GraduationCap className="h-6 w-6" />
              </Link>
            </div>
          </div>
          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Building2, label: 'Colleges', value: '50+' },
              { icon: BookOpen, label: 'Courses', value: '200+' },
              { icon: Users, label: 'Students', value: '10,000+' },
              { icon: Award, label: 'Success Rate', value: '95%' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-yellow-300" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-blue-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Colleges</h2>
            <p className="text-gray-500">Discover top institutions for your academic journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {colleges.map((col) => (
              <Link to={`/colleges/${col.college_id}`} key={col.college_id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col">
                <div className="h-48 overflow-hidden relative bg-slate-200">
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
                  <div className="absolute top-4 right-4 bg-emerald-400/90 text-emerald-950 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                    Featured
                  </div>
                  <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wide">
                    {col.province || 'Nepal'}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{col.college_name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 font-medium">
                    <MapPin className="h-4 w-4 text-gray-400" /> {col.location}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-6 flex-1">{col.description}</p>
                  <div className="mt-auto text-blue-600 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Explore Admissions <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/colleges" className="btn-primary inline-flex items-center gap-2">View All Colleges <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Popular Courses</h2>
            <p className="text-gray-500">Explore programs that match your career goals</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link to={`/courses/${course.course_id}`} key={course.course_id} className="card p-5 hover:-translate-y-1">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{course.course_name}</h3>
                <p className="text-sm text-gray-500 mb-3">{course.college_name}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>
                  <span>Rs. {Number(course.fee).toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/courses" className="btn-primary inline-flex items-center gap-2">Browse All Courses <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose EduPortal Max?</h2>
            <p className="text-gray-500">Making admissions easier, faster, and transparent</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Easy Online Application', desc: 'Apply to multiple colleges from the comfort of your home.', icon: '📝' },
              { title: 'Real-Time Tracking', desc: 'Track your application status in real-time with instant notifications.', icon: '📊' },
              { title: 'Secure Document Upload', desc: 'Upload and manage your academic documents securely.', icon: '🔒' },
              { title: 'Online Payment', desc: 'Pay admission fees online with multiple payment options.', icon: '💳' },
              { title: 'Instant Notifications', desc: 'Get notified about every step of your admission process.', icon: '🔔' },
              { title: 'Direct Communication', desc: 'Message admins and get your queries resolved quickly.', icon: '💬' },
            ].map((b, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl hover:bg-blue-50 transition-all">
                <div className="text-3xl">{b.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Admission Process</h2>
            <p className="text-gray-500">Simple 5-step admission process</p>
          </div>
          <div className="grid sm:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Browse', desc: 'Explore colleges & courses' },
              { step: '02', title: 'Register', desc: 'Create your account' },
              { step: '03', title: 'Apply', desc: 'Fill admission form' },
              { step: '04', title: 'Upload', desc: 'Submit documents & pay' },
              { step: '05', title: 'Admitted', desc: 'Get admission result' },
            ].map((s, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-3xl font-bold gradient-text mb-2">{s.step}</div>
                <h4 className="font-bold text-gray-900 mb-1">{s.title}</h4>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of students who have already secured their future through EduPortal Max.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg">
              Create Account
            </Link>
            <Link to="/about" className="border-2 border-white/30 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
