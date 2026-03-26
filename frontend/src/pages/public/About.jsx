import { GraduationCap, Users, Award, Globe, Target, Heart, Shield, Zap, Sparkles, BookOpen, Lightbulb, Rocket } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero_campus_bg.png')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 via-transparent to-cyan-500/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl mb-6 shadow-xl shadow-rose-500/30">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-purple-300">
            About EduPortal Max
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto leading-relaxed font-light">
            EduPortal Max represents the absolute pinnacle of digital architecture within the modern educational ecosystem. We are not just an application; we are a massive, transformative philosophy aimed at completely digitalizing, optimizing, and securing the entire lifecycle of the college admission process across every single province in Nepal.
          </p>
        </div>
      </section>

      {/* Comprehensive Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 font-bold tracking-wide">
                <Target className="h-5 w-5" /> The Great Mission
              </div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">
                Democratizing Access to Elite Educational Institutions Nationwide.
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  At EduPortal Max, our driving mission is fundamentally rooted in the belief that access to quality higher education must never be hindered by geographical barriers, bureaucratic red tape, or informational asymmetry. For decades, the college admission process has been painfully analog—requiring high school graduates to travel hundreds of kilometers across challenging terrains merely to submit paper applications, stand in endless queues, and navigate highly fragmented information networks. 
                </p>
                <p>
                  Our mission is to obliterate these archaic barriers entirely. By unifying thousands of courses across 35 elite institutions scattered precisely across the 7 provinces of Nepal, we have built a highly secure, centralized, and brilliantly automated gateway. We empower every single student—whether they reside in the bustling metropolis of Bagmati or the remote valleys of Karnali—with exactly the same crystal-clear visibility, instantaneous application capabilities, and powerful communication tools. EduPortal Max transforms weeks of grueling administrative friction into just a flawless five-minute digital interaction, enabling students to focus entirely on their academic ambitions rather than logistical nightmares.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-600 font-bold tracking-wide">
                <Globe className="h-5 w-5" /> The Ultimate Vision
              </div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">
                Building an Interconnected, Highly Intelligent Academic Ecosystem.
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Looking beyond immediate problem-solving, the true vision of EduPortal Max is to evolve into a highly intelligent, self-sustaining academic ecosystem that continually optimizes itself using powerful data analytics. We envision a future where universities and colleges do not merely receive applications, but utilize our advanced dashboards to perfectly match institutional capacities with student potential on a massive scale. 
                </p>
                <p>
                  Our roadmap includes integrating robust artificial intelligence architectures to predict student success, highly intuitive scholarship-matching algorithms, and expansive virtual reality campus tours that allow students to deeply explore institutions intimately from their smartphones. By providing administrators with unprecedented granular control—referred to seamlessly in our doctrine as "Maximum Control, Minimum Effort"—we envision transforming the educational governance paradigm. We foresee a nationwide reality where an applicant's entire academic journey, verified documents, robust financial transactions, and holistic metrics are elegantly unified in a single, deeply secure digital identity right here on EduPortal Max.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technological Architecture & Core Philosophies */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-rose-500/10 to-transparent blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
              The Architecture of Excellence
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              EduPortal Max is highly engineered on modern, immensely scalable frameworks. We do not just process data; we safeguard, optimize, and present it with uncompromising aesthetic brilliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:-translate-y-2 transition-transform duration-300">
              <Shield className="h-12 w-12 text-emerald-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Fortified Data Security</h3>
              <p className="text-slate-300 leading-relaxed">
                Security is our absolute paramount directive. Utilizing advanced cryptographic hashing for highly sensitive user credentials and employing top-tier JSON Web Token (JWT) strategies, we ensure that every single interaction, document upload, and strict administrative action operates within a deeply secure, highly encrypted environment. Students can entrust their vital personal data with absolute peace of mind.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:-translate-y-2 transition-transform duration-300">
              <Zap className="h-12 w-12 text-rose-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Unprecedented Speed</h3>
              <p className="text-slate-300 leading-relaxed">
                Time is the most valuable currency for an ambitious student. Our backend is mercilessly optimized to process thousands of concurrent queries without breaking a sweat. The incredibly fluid frontend utilizes state-of-the-art virtual DOM manipulations, completely eradicating sluggish page loads and resulting in an impeccably smooth user experience that feels remarkably instantaneous and highly responsive.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:-translate-y-2 transition-transform duration-300">
              <Sparkles className="h-12 w-12 text-amber-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Stunning Aesthetics</h3>
              <p className="text-slate-300 leading-relaxed">
                We definitively reject the notion that complex administrative software must be visually sterile. EduPortal Max proudly features an aggressively beautiful, massively expansive 4+ color gradient philosophy mixed with elegant glassmorphism and stunning typography. Using this platform is designed to be an inspiring, engaging, and genuinely enjoyable visual masterpiece from the first login.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Scale */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[3rem] p-12 lg:p-16 text-center text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl font-black mb-12">Impacting the Nation, Province by Province</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                {[
                  { value: '7', label: 'Provinces Integrated' },
                  { value: '35+', label: 'Elite Institutions' },
                  { value: '1,000s', label: 'Student Applications' },
                  { value: '100%', label: 'Digital Transparency' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                    <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-200 mb-2">{s.value}</div>
                    <div className="text-indigo-100 font-medium tracking-wide uppercase text-sm">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold shadow-xl border border-white/30 text-lg">
                <Rocket className="h-6 w-6 text-amber-300" /> A Final Year Project Developed to Solve Real-World Problems.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
