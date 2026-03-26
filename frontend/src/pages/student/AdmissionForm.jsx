import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getColleges, getCourses, createApplication } from '../../services/api';
import { FilePlus, CheckCircle, Map, Building2, BookOpen, Award } from 'lucide-react';

const PROVINCES = ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];

export default function AdmissionForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [colleges, setColleges] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    course_id: '',
    father_name: '', mother_name: '', dob: '', gender: '', nationality: 'Nepali',
    gpa: '', board: 'NEB', passed_year: '', school: ''
  });

  useEffect(() => {
    // Fetch all required base data for seamless filtering
    Promise.all([
      getColleges({ status: 'active' }).then(r => r.data.data || []),
      getCourses({ status: 'active' }).then(r => r.data.data || [])
    ]).then(([colldata, coursedata]) => {
      setColleges(colldata);
      setAllCourses(coursedata);
    }).catch(err => console.error("Failed to load form data", err));
  }, []);

  // Filter Logic
  const filteredColleges = selectedProvince 
    ? colleges.filter(c => c.province === selectedProvince) 
    : colleges;
    
  const filteredCourses = selectedCollegeId 
    ? allCourses.filter(c => c.college_id === Number(selectedCollegeId))
    : allCourses.filter(c => filteredColleges.map(fc => fc.college_id).includes(c.college_id));

  // Reset downstream selections when upstream changes
  const handleProvinceChange = (val) => {
    setSelectedProvince(val);
    setSelectedCollegeId('');
    setForm(prev => ({ ...prev, course_id: '' }));
  };

  const handleCollegeChange = (val) => {
    setSelectedCollegeId(val);
    setForm(prev => ({ ...prev, course_id: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Debug: Check role before submission
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Current session role:", payload.role);
        if (payload.role !== 'student') {
          setError(`Warning: Your current session is logged in as an "${payload.role}", but this form is for students only. Please Logout and Login as a student.`);
          setLoading(false);
          return;
        }
      }
    } catch (e) { console.error("Session check failed", e); }

    setLoading(true);
    try {
      await createApplication({
        course_id: form.course_id,
        personal_info: { father_name: form.father_name, mother_name: form.mother_name, dob: form.dob, gender: form.gender, nationality: form.nationality },
        academic_info: { gpa: form.gpa, board: form.board, passed_year: form.passed_year, school: form.school, scholarship_awarded: scholarshipOffer || 'None' }
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateScholarship = (gpaStr, board) => {
    if (!gpaStr || !board) return null;
    const num = parseFloat(gpaStr.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return null;

    // Verify it is "+2" (NEB)
    if (board.includes('NEB')) {
      if (!gpaStr.includes('%') && num >= 3.9) {
        return "100% Merit Scholarship";
      } else if (gpaStr.includes('%') && num >= 90) {
        return "100% Merit Scholarship";
      }
    }
    return null;
  };

  const scholarshipOffer = calculateScholarship(form.gpa, form.board);

  if (success) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-green-500/10 p-12 border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-6 drop-shadow-sm" />
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Application Submitted!</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Your comprehensive admission dossier has been securely routed to the institution and is currently under administrative review.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/student/applications')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all">View Status</button>
            <button onClick={() => navigate('/student/documents')} className="bg-white text-gray-700 font-bold py-3 px-8 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">Upload Docs</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 md:p-10 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black flex items-center gap-3 mb-2 tracking-tight"><FilePlus className="h-8 w-8 text-blue-200" /> Dynamic Admission Gateway</h1>
          <p className="text-blue-100 font-light text-lg">Seamlessly navigate thousands of programs across all 7 provinces.</p>
        </div>
      </div>

      {/* Modern Progress Stepper */}
      <div className="flex items-center justify-between px-4 mb-4 relative">
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-200 -z-10 rounded-full transform -translate-y-1/2"></div>
        {[
          { label: 'Program Selection', icon: BookOpen },
          { label: 'Personal Dossier', icon: Map },
          { label: 'Academic History', icon: Building2 }
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-300 shadow-sm ${step > i + 1 ? 'bg-gradient-to-br from-emerald-400 to-green-600 text-white scale-110 shadow-green-500/30' : step === i + 1 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white ring-4 ring-blue-100 scale-110 shadow-blue-500/30' : 'bg-white text-gray-400 border border-gray-200'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-bold mt-3 hidden sm:block tracking-wide ${step === i + 1 ? 'text-indigo-600 flex flex-col items-center' : 'text-gray-400'}`}>
              {s.label}
              {step === i + 1 && <div className="h-1 w-12 bg-indigo-600 rounded-full mt-1"></div>}
            </span>
          </div>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-600 font-medium px-4 py-3 rounded-xl text-sm border border-red-100 flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500"></div>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Step 1: Program Selection</h2>
                <p className="text-gray-500 mb-6">Filter down starting from your desired geographic region.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <Map className="h-4 w-4 text-blue-500" /> 1. Province
                  </label>
                  <select value={selectedProvince} onChange={e => handleProvinceChange(e.target.value)} className="w-full bg-slate-50 border border-gray-200 px-4 py-3.5 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium appearance-none">
                    <option value="">All Provinces Nationwide</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p} Province</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-indigo-500" /> 2. Institution
                  </label>
                  <select disabled={colleges.length === 0} value={selectedCollegeId} onChange={e => handleCollegeChange(e.target.value)} className="w-full bg-slate-50 border border-gray-200 px-4 py-3.5 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium appearance-none disabled:opacity-50">
                    <option value="">{selectedProvince ? 'All Colleges in Region' : 'All Colleges Nationwide'}</option>
                    {filteredColleges.map(c => (
                      <option key={c.college_id} value={c.college_id}>{c.college_name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-500" /> 3. Academic Program
                  </label>
                  <select required value={form.course_id} onChange={e => setForm({...form, course_id: e.target.value})} className="w-full bg-slate-50 border border-gray-200 px-4 py-3.5 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium appearance-none">
                    <option value="">Select Specific Program...</option>
                    {filteredCourses.map(c => (
                      <option key={c.course_id} value={c.course_id}>{c.course_name} (Rs. {Number(c.fee).toLocaleString()})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100">
                <button type="button" onClick={() => { if (form.course_id) setStep(2); else setError('Please isolate exactly one Academic Program to proceed.'); }} className="bg-gray-900 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2">
                  Proceed to Intelligence <span className="text-xl leading-none">→</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Step 2: Personal Identification</h2>
                <p className="text-gray-500 mb-6">Enter precisely as printed on your strict academic citizenship documents.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                <div><label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Father's Full Legal Name</label><input required value={form.father_name} onChange={e => setForm({...form, father_name: e.target.value})} className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Mother's Full Legal Name</label><input required value={form.mother_name} onChange={e => setForm({...form, mother_name: e.target.value})} className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Date of Birth</label><input required type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Biological Gender</label>
                  <select required value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    <option value="">Select Identity</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Primary Nationality</label><input value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" /></div>
              </div>

              <div className="flex justify-between pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setStep(1)} className="text-gray-500 font-bold px-6 py-3 hover:text-gray-900 transition-colors">← Retreat</button>
                <button type="button" onClick={() => setStep(3)} className="bg-gray-900 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2">Proceed to History <span className="text-xl leading-none">→</span></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Step 3: Academic History</h2>
                <p className="text-gray-500 mb-6">Quantify your prior academic performance rigorously.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                <div><label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Cumulative GPA / Percent</label><input required value={form.gpa} onChange={e => setForm({...form, gpa: e.target.value})} className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500 font-bold" placeholder="e.g., 3.6 or 85%" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Accrediting Board</label>
                  <select value={form.board} onChange={e => setForm({...form, board: e.target.value})} className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
                    <option>NEB (National Exam Board)</option><option>CTEVT</option><option>Cambridge A-Levels</option><option>Other International</option>
                  </select>
                </div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Graduation Year</label><input required value={form.passed_year} onChange={e => setForm({...form, passed_year: e.target.value})} className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="2025" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Institution Name</label><input required value={form.school} onChange={e => setForm({...form, school: e.target.value})} className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500" /></div>
              </div>

              {scholarshipOffer && (
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl p-5 text-white shadow-lg shadow-yellow-500/20 transform transition-all animate-in fade-in zoom-in duration-300 border border-yellow-400">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm shrink-0">
                      <Award className="h-6 w-6 text-yellow-50" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-white mb-1 tracking-tight flex items-center gap-2">
                        🌟 Merit Scholarship Unlocked!
                      </h3>
                      <p className="text-yellow-50 text-sm font-medium">
                        Based on your outstanding academic performance, you are pre-approved for a <strong className="text-white px-2 py-0.5 bg-yellow-400/30 rounded-md ml-1">{scholarshipOffer}</strong>!
                      </p>
                      <p className="text-yellow-100/80 text-xs mt-2 font-medium">
                        * Subject to document verification by administrative staff.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setStep(2)} className="text-gray-500 font-bold px-6 py-3 hover:text-gray-900 transition-colors">← Retreat</button>
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-10 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2">
                  {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Finalize & Submit Vector'}
                </button>
              </div>
            </div>
          )}

        </div>
      </form>
    </div>
  );
}
