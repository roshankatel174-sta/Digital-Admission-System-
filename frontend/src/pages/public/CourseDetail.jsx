import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourse } from '../../services/api';
import { BookOpen, Clock, Users, Building2, MapPin, CheckCircle, Briefcase, ArrowRight, GraduationCap } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourse(id).then(r => { setCourse(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center py-32"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  if (!course) return <div className="text-center py-32 text-gray-400">Course not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <Link to="/courses" className="hover:text-white">Courses</Link> / <span>{course.course_name}</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">{course.course_name}</h1>
          <div className="flex flex-wrap gap-4 text-blue-100">
            <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{course.college_name}</span>
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{course.location}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{course.duration}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Overview</h2>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>

            {course.eligibility && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-blue-500" />Eligibility</h2>
                <p className="text-gray-600">{course.eligibility}</p>
              </div>
            )}

            {course.career_opportunities && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Briefcase className="h-5 w-5 text-green-500" />Career Opportunities</h2>
                <div className="flex flex-wrap gap-2">
                  {course.career_opportunities.split(',').map((c, i) => (
                    <span key={i} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">{c.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Course Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{course.duration}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total Fee</span><span className="font-bold text-blue-600">Rs. {Number(course.fee).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Seats</span><span className="font-medium">{course.seats}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`badge ${course.status === 'active' ? 'badge-approved' : 'badge-rejected'}`}>{course.status}</span></div>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <h3 className="font-bold text-lg mb-2">Interested?</h3>
              <p className="text-blue-100 text-sm mb-4">Apply now and secure your seat</p>
              <Link to="/student/apply" className="block text-center bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-all">
                Apply Now <ArrowRight className="h-4 w-4 inline ml-1" />
              </Link>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-3">College</h3>
              <Link to={`/colleges/${course.college_id}`} className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                <Building2 className="h-4 w-4" /> {course.college_name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
