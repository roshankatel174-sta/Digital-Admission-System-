import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCollege, getCollegeReviews, addCollegeReview } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Building2, MapPin, Mail, Phone, BookOpen, Award, CheckCircle, ArrowRight, Clock, Users, Star, MessageSquare } from 'lucide-react';

export default function CollegeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [college, setCollege] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCollege(id).then(r => r.data.data).catch(() => null),
      getCollegeReviews(id).then(r => r.data.data).catch(() => [])
    ]).then(([collegeData, reviewsData]) => {
      setCollege(collegeData);
      setReviews(reviewsData || []);
      setLoading(false);
    });
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    setSubmittingReview(true);
    try {
      await addCollegeReview(id, { rating: newRating, review_text: newReviewText });
      const r = await getCollegeReviews(id);
      setReviews(r.data.data || []);
      setNewReviewText('');
      setNewRating(5);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-32"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  if (!college) return <div className="text-center py-32 text-gray-400">College not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="h-32 w-32 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden ring-4 ring-white/20 shadow-xl bg-gray-200">
              <img 
                src={college.image 
                  ? `http://localhost:5000/uploads/${college.image}` 
                  : [
                      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1562774053-7019fdb332f4?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80"
                    ][(college.college_id || 0) % 5]
                } 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80";
                }}
                alt={college.college_name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{college.college_name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100 mb-3">
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">{college.province}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{college.location}</span>
                {college.contact_email && <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{college.contact_email}</span>}
                {college.contact_phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{college.contact_phone}</span>}
              </div>
              <span className={`inline-block mt-3 badge ${college.status === 'active' ? 'bg-green-400/20 text-green-200' : 'bg-red-400/20 text-red-200'}`}>
                {college.status === 'active' ? '✓ Admissions Open' : '✗ Closed'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="card p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Overview & Details</h2>
              <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-4">
                {college.description?.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-justify">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Achievements */}
            {college.achievements && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-yellow-500" />Achievements</h2>
                <div className="space-y-2">
                  {college.achievements.split(',').map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{a.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courses */}
            {college.courses?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-500" />Available Courses</h2>
                <div className="space-y-4">
                  {college.courses.map(c => (
                    <Link to={`/courses/${c.course_id}`} key={c.course_id} className="block p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{c.course_name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{c.duration}</span>
                            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{c.seats} seats</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">Rs. {Number(c.fee).toLocaleString()}</p>
                          <ArrowRight className="h-4 w-4 text-gray-400 ml-auto mt-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> Reviews & Ratings
                <span className="text-sm font-normal text-gray-500 ml-2">({reviews.length} reviews)</span>
              </h2>

              {/* Review List */}
              <div className="space-y-4 mb-8">
                {reviews.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">No reviews yet. Be the first to review!</div>
                ) : (
                  reviews.map((r) => (
                    <div key={r.review_id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-800">{r.student_name}</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`h-4 w-4 ${star <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{r.review_text}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Leave a Review */}
              {user && user.role === 'student' ? (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Leave a Review</h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-600 mb-1">Rating</label>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <button type="button" key={star} onClick={() => setNewRating(star)} className="focus:outline-none hover:-translate-y-0.5 transition-transform">
                            <Star className={`h-6 w-6 ${star <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-600 mb-1">Your Review</label>
                      <textarea 
                        className="input-field w-full min-h-[100px]" 
                        placeholder="Share your experience with this college..." 
                        value={newReviewText} 
                        onChange={e => setNewReviewText(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" disabled={submittingReview} className="btn-primary">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex justify-between items-center border border-blue-100 shadow-sm">
                  <span>Log in as a student to leave a review.</span>
                  <Link to="/login" className="bg-white text-blue-600 px-4 py-1.5 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors border border-blue-200">Log In</Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Facilities */}
            {college.facilities && (
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 mb-3">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {college.facilities.split(',').map((f, i) => (
                    <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">{f.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-3">Contact Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 text-blue-500" /> {college.contact_email || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 text-blue-500" /> {college.contact_phone || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-500" /> {college.location}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="card p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <h3 className="font-bold text-lg mb-2">Ready to Apply?</h3>
              <p className="text-blue-100 text-sm mb-4">Start your admission process today</p>
              <Link to="/register" className="block text-center bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-all">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
