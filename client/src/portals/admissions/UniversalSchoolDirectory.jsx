import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Award, ArrowRight, GraduationCap, CheckCircle2, Building, Sparkles } from 'lucide-react';
import { useGetPublicSchoolsDirectoryQuery } from '../../store/api/admissionsApi';

export default function UniversalSchoolDirectory() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedBoard, setSelectedBoard] = useState('ALL');
    const { data: schoolsRes, isLoading } = useGetPublicSchoolsDirectoryQuery({ search });

    const schools = schoolsRes?.data || [];

    const filteredSchools = schools.filter((s) => {
        if (selectedBoard === 'ALL') return true;
        return s.board === selectedBoard;
    });

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const activeSession = currentMonth >= 3
        ? `${currentYear}-${String(currentYear + 1).slice(2)}`
        : `${currentYear - 1}-${String(currentYear).slice(2)}`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                            <GraduationCap size={22} />
                        </div>
                        <div>
                            <span className="text-lg font-black tracking-tight text-slate-900 font-display block leading-none">
                                Prime<span className="text-blue-600">School</span>OS
                            </span>
                            <span className="text-[10px] text-slate-700 font-semibold font-bold uppercase tracking-widest">
                                Admissions Portal
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admissions/track')}
                            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            Track Application
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/auth/login')}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                            Staff Login
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={14} className="text-amber-400" />
                        Admissions Open • Academic Year {activeSession}
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white">
                        Find &amp; Apply to Your Dream School
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
                        Explore verified schools, compare academic programs, and submit your online admission application in minutes.
                    </p>

                    {/* Search & Board Filter Bar */}
                    <div className="max-w-2xl mx-auto pt-4">
                        <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-100">
                            <div className="relative flex-1 w-full">
                                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 font-medium" />
                                <input
                                    type="text"
                                    placeholder="Search by school name, city, or locality..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 font-medium outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
                                {['ALL', 'CBSE', 'ICSE'].map((board) => (
                                    <button
                                        key={board}
                                        type="button"
                                        onClick={() => setSelectedBoard(board)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            selectedBoard === board
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {board}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* School Cards Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                            Partner Schools Accepting Admissions
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                            Showing {filteredSchools.length} verified institutions
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-80 rounded-3xl bg-slate-200 animate-pulse" />
                        ))}
                    </div>
                ) : filteredSchools.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                        <Building size={48} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="text-base font-bold text-slate-800">No schools found</h3>
                        <p className="text-xs text-slate-700 font-medium mt-1">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSchools.map((school) => (
                            <div
                                key={school.id}
                                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                            >
                                {/* School Banner Image */}
                                <div className="h-44 relative overflow-hidden bg-slate-900">
                                    <img
                                        src={
                                            school.coverImageUrl ||
                                            'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80'
                                        }
                                        alt={school.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-blue-700 shadow-xs border border-white">
                                            {school.board || 'CBSE'}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-white">
                                        <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md shrink-0 flex items-center justify-center">
                                            {school.logoUrl ? (
                                                <img src={school.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                            ) : (
                                                <Building className="text-blue-600" size={20} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold truncate text-white leading-tight font-display">
                                                {school.name}
                                            </h3>
                                            <p className="text-[11px] text-slate-200 flex items-center gap-1 mt-0.5 truncate">
                                                <MapPin size={11} className="shrink-0 text-amber-400" />
                                                <span>{school.city}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                                            {school.tagline || 'Excellence in holistic academic education and character development.'}
                                        </p>
                                        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-700 font-semibold">
                                            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                                <CheckCircle2 size={12} /> Admissions Open
                                            </span>
                                            <span>Session {school.admissionSettings?.academicYear || activeSession}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/admissions/${school.slug}`)}
                                            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <span>View Details</span>
                                            <ArrowRight size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/admissions/${school.slug}/apply`)}
                                            className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
