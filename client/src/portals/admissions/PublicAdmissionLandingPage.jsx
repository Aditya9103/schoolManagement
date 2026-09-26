import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    GraduationCap,
    CheckCircle2,
    ArrowRight,
    MapPin,
    Phone,
    Mail,
    Award,
    Sparkles,
    Calendar,
    BookOpen,
    Users,
    ShieldCheck,
    Search,
    Clock,
    FileCheck,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { useGetPublicSchoolBySlugQuery } from '../../store/api/admissionsApi';

const PROGRAMS = [
    {
        name: 'Pre-Primary',
        classes: 'Nursery – KG',
        icon: '🌱',
        bg: 'from-amber-500/10 to-orange-500/10',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800',
        desc: 'Play-based early learning, sensory stimulation, social habit building, and phonics foundation.',
    },
    {
        name: 'Primary',
        classes: 'Class 1 – 5',
        icon: '📚',
        bg: 'from-emerald-500/10 to-teal-500/10',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800',
        desc: 'Core language mastery, experiential mathematics, introductory sciences, arts, and physical fitness.',
    },
    {
        name: 'Middle School',
        classes: 'Class 6 – 8',
        icon: '🔬',
        bg: 'from-blue-500/10 to-indigo-500/10',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-800',
        desc: 'Inquiry-driven STEM modules, critical thinking labs, languages, debating, and team sports.',
    },
    {
        name: 'Secondary',
        classes: 'Class 9 – 10',
        icon: '🎯',
        bg: 'from-purple-500/10 to-pink-500/10',
        border: 'border-purple-200',
        badge: 'bg-purple-100 text-purple-800',
        desc: 'National curriculum excellence, board examination readiness, career exploration, and robotics.',
    },
    {
        name: 'Senior Secondary',
        classes: 'Class 11 – 12',
        icon: '🎓',
        bg: 'from-rose-500/10 to-red-500/10',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-800',
        desc: 'Specialized streams in Science, Commerce, and Humanities with dedicated competitive exam mentoring.',
    },
];

const HIGHLIGHTS = [
    { icon: Award, title: 'CBSE Affiliated', subtitle: 'National standard benchmark curriculum' },
    { icon: Sparkles, title: 'Modern Campus', subtitle: 'Smart classes, labs, & athletic arena' },
    { icon: Users, title: 'Experienced Faculty', subtitle: '1:18 Teacher-student mentorship ratio' },
    { icon: ShieldCheck, title: 'Holistic Development', subtitle: 'Co-curriculars, sports, & mental wellness' },
];

const ADMISSION_STEPS = [
    { step: '01', title: 'Submit Online Form', desc: 'Fill applicant & parent details in our streamlined 5-step wizard.' },
    { step: '02', title: 'Upload Documents', desc: 'Upload birth certificate, previous marksheet, and student photograph.' },
    { step: '03', title: 'Entrance Assessment', desc: 'Attend interactive session or grade-level proficiency assessment.' },
    { step: '04', title: 'Offer & Enrollment', desc: 'Receive offer letter, complete fee payment, and confirm admission.' },
];

export default function PublicAdmissionLandingPage() {
    const { schoolSlug } = useParams();
    const navigate = useNavigate();

    const { data: res, isLoading, error } = useGetPublicSchoolBySlugQuery(schoolSlug, {
        skip: !schoolSlug,
    });

    const school = res?.data?.school;
    const settings = res?.data?.settings;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                    <p className="text-sm font-semibold text-slate-600">Loading school admission portal...</p>
                </div>
            </div>
        );
    }

    if (error || !school) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-rose-100 text-rose-700 font-bold rounded-2xl flex items-center justify-center mx-auto">
                        <Search size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">School Not Found</h2>
                    <p className="text-sm text-slate-600">
                        We could not find an admission portal for <span className="font-mono font-bold text-slate-900">"{schoolSlug}"</span>. Please check the URL or browse all available schools.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admissions')}
                            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition-colors"
                        >
                            Browse School Directory
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const activeAcademicYear = res?.data?.activeAcademicYear;
    const academicYear = activeAcademicYear?.name || settings?.academicYear || 'Current';
    const academicYearId = activeAcademicYear?._id || settings?.academicYearId;
    const isAdmissionOpen = settings ? settings.isAdmissionOpen : true;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* ── Top Header / Navbar ────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {school.logo ? (
                            <img src={school.logo} alt={school.name} className="w-12 h-12 rounded-xl object-contain shadow-xs border border-slate-100 p-1" />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black text-xl">
                                {school.name?.charAt(0) || 'S'}
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                                {school.name}
                            </h1>
                            <p className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                                <span className="font-semibold text-blue-600">{school.board || 'CBSE'} Board</span>
                                <span>•</span>
                                <span>{school.address?.city || 'Campus'}</span>
                            </p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
                        <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
                        <a href="#academics" className="hover:text-blue-600 transition-colors">Programs</a>
                        <a href="#process" className="hover:text-blue-600 transition-colors">Process</a>
                        <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(`/admissions/${schoolSlug}/track`)}
                            className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-xl transition-all cursor-pointer"
                        >
                            Track Application
                        </button>
                        {isAdmissionOpen ? (
                            <button
                                type="button"
                                onClick={() => navigate(`/admissions/${schoolSlug}/apply`)}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                Apply Now
                                <ArrowRight size={14} />
                            </button>
                        ) : (
                            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-medium text-xs font-semibold">
                                Admissions Closed
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Hero Banner Section (Matches UI 2 Step 1) ─────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
                {/* Background Campus Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Hero Content */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide">
                            <Sparkles size={14} className="text-amber-400" />
                            Official Admissions Portal • {school.name}
                        </div>

                        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight font-display">
                            Every Child Deserves <br />
                            <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                                a Brighter Tomorrow
                            </span>
                        </h2>

                        <p className="text-base sm:text-lg text-slate-300 max-w-xl font-medium leading-relaxed">
                            {settings?.heroSubtitle || 'Nurturing potential, building character, shaping future leaders in a state-of-the-art learning ecosystem.'}
                        </p>

                        {/* Badges Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            {HIGHLIGHTS.map((h, i) => {
                                const Icon = h.icon;
                                return (
                                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                                        <Icon size={18} className="text-amber-400 shrink-0" />
                                        <span className="text-xs font-bold text-white leading-tight">{h.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Hero CTA Card (Matching UI 2 Step 1 Floating Card) */}
                    <div className="lg:col-span-5">
                        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 text-slate-900 space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="space-y-1">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
                                        <CheckCircle2 size={12} />
                                        Admissions Open
                                    </span>
                                    <h3 className="text-lg font-black text-slate-900">
                                        Academic Year {academicYear}
                                    </h3>
                                    {academicYearId && (
                                        <span className="text-[10px] font-mono text-slate-600 font-semibold block">
                                            ID: {academicYearId}
                                        </span>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] text-slate-700 font-semibold font-bold block">Application Fee</span>
                                    <span className="text-base font-black text-slate-900">
                                        {settings?.applicationFee?.amount ? `₹${settings.applicationFee.amount}` : 'Free'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                Applications are now open for Pre-Primary to Grade 12. Submit your online registration early to secure your seat.
                            </p>

                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/admissions/${schoolSlug}/apply`)}
                                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-sm tracking-wide shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                                >
                                    <span>Apply for Admission</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate(`/admissions/${schoolSlug}/track`)}
                                    className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Search size={14} className="text-slate-500" />
                                    <span>Track Existing Application</span>
                                </button>
                            </div>

                            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-700 font-semibold border-t border-slate-100">
                                <span>✨ Quick 5-min online form</span>
                                <span>📄 Instant confirmation slip</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Academic Programs (Matches UI 2 Step 1 Bottom Cards) ──────── */}
            <section id="academics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        Curriculum &amp; Streams
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Programs Offered
                    </h3>
                    <p className="text-sm text-slate-600">
                        Tailored learning journeys designed to nurture intellectual curiosity, creative inquiry, and athletic excellence at every stage.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {PROGRAMS.map((prog, idx) => (
                        <div
                            key={idx}
                            className={`p-5 rounded-2xl bg-white border ${prog.border}hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1`}
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl p-2 rounded-xl bg-slate-50 border border-slate-100">
                                        {prog.icon}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${prog.badge}`}>
                                        {prog.classes}
                                    </span>
                                </div>
                                <h4 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {prog.name}
                                </h4>
                                <p className="text-xs text-slate-700 font-medium leading-relaxed font-normal">
                                    {prog.desc}
                                </p>
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/admissions/${schoolSlug}/apply`)}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                                >
                                    Apply for {prog.name}
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Admission Process Steps ───────────────────────────────────── */}
            <section id="process" className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-2 max-w-2xl mx-auto">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-800">
                            Transparent &amp; Simple
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            Admission In 4 Easy Steps
                        </h3>
                        <p className="text-sm text-slate-300">
                            Follow our streamlined admission pipeline from initial inquiry to welcome orientation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ADMISSION_STEPS.map((s, idx) => (
                            <div key={idx} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition-colors space-y-3">
                                <span className="text-3xl font-black text-blue-400 font-display block">
                                    {s.step}
                                </span>
                                <h4 className="text-base font-bold text-white">{s.title}</h4>
                                <p className="text-xs text-slate-300 leading-relaxed font-normal">{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/admissions/${schoolSlug}/apply`)}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 cursor-pointer transition-all"
                        >
                            <span>Start Your Application</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────────────────── */}
            <footer id="contact" className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="text-blue-600" size={24} />
                            <span className="text-base font-black text-slate-900">{school.name}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium max-w-sm">
                            Affiliated with {school.board || 'CBSE'}. Dedicated to academic rigor, student happiness, and holistic character formation.
                        </p>
                        <div className="pt-2 flex items-center gap-4 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                                <Phone size={14} className="text-blue-600" />
                                {school.phone || '+91 98765 43210'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Mail size={14} className="text-blue-600" />
                                {school.email || 'admissions@greenwood.edu'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-xs font-medium text-slate-600">
                            <li><button type="button" onClick={() => navigate(`/admissions/${schoolSlug}/apply`)} className="hover:text-blue-600">Apply Online</button></li>
                            <li><button type="button" onClick={() => navigate(`/admissions/${schoolSlug}/track`)} className="hover:text-blue-600">Track Application</button></li>
                            <li><button type="button" onClick={() => navigate('/admissions')} className="hover:text-blue-600">All Schools Directory</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">Campus Address</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {school.address?.street ? `${school.address.street}, ` : ''}
                            {school.address?.city || 'Greenwood Campus'}, {school.address?.state || 'State'} {school.address?.pincode ? `- ${school.address.pincode}` : ''}
                        </p>
                        <p className="text-[11px] text-slate-600 font-semibold mt-4">
                            Powered by <span className="font-bold text-slate-600">PrimeSchoolOS</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
