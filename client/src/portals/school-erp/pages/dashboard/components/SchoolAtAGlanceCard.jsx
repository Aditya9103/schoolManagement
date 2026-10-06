import React, { useState } from 'react';
import {
    Building2,
    Award,
    GraduationCap,
    Users,
    MapPin,
    Bus,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function SchoolAtAGlanceCard({ school, stats }) {
    const images = [
        school?.coverImageUrl,
        'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80'
    ].filter(Boolean);

    const [currentIdx, setCurrentIdx] = useState(0);

    const handlePrev = () => {
        setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const totalStudents = stats?.summary?.totalStudents != null
        ? stats.summary.totalStudents.toLocaleString()
        : '0';

    const facultyCount = stats?.summary?.totalTeachers != null
        ? stats.summary.totalTeachers
        : 0;

    const estYear = school?.establishedYear || (school?.createdAt ? new Date(school.createdAt).getFullYear() : 'N/A');
    const board = school?.board || 'CBSE';
    const campusArea = school?.campusArea || school?.address?.city || 'Campus';
    const buses = school?.transportBuses || 0;

    const statChips = [
        { label: `Est. ${estYear}`, sub: 'Founded', icon: Building2, color: 'text-blue-600' },
        { label: `${board}`, sub: 'Affiliation', icon: Award, color: 'text-amber-600' },
        { label: `${totalStudents}`, sub: 'Students', icon: GraduationCap, color: 'text-purple-600' },
        { label: `${facultyCount}`, sub: 'Faculty', icon: Users, color: 'text-emerald-600' },
        { label: `${campusArea}`, sub: 'Campus', icon: MapPin, color: 'text-teal-600' },
        { label: `${buses}`, sub: 'Buses', icon: Bus, color: 'text-orange-500' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight mb-2 whitespace-nowrap">
                School at a Glance
            </h3>

            {/* Campus Image Preview Carousel */}
            <div className="relative rounded-xl overflow-hidden h-26 sm:h-28 w-full group mb-2.5 shadow-inner bg-slate-100">
                <img
                    src={images[currentIdx] || images[0]}
                    alt={school?.name || 'School Campus'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous photo"
                            className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next photo"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
                            {images.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`w-1 h-1 rounded-full transition-all ${
                                        idx === currentIdx ? 'bg-white w-2.5' : 'bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* 6 Clean Stat Chips Without Truncation */}
            <div className="grid grid-cols-3 gap-1.5">
                {statChips.map((chip, idx) => {
                    const Icon = chip.icon;
                    return (
                        <div
                            key={idx}
                            className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-lg border border-slate-100/90"
                        >
                            <Icon className={`w-3.5 h-3.5 ${chip.color}shrink-0`} />
                            <div className="min-w-0">
                                <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-800 block leading-tight truncate">
                                    {chip.label}
                                </span>
                                <span className="text-[8px] text-slate-600 font-semibold uppercase tracking-wide block leading-none">
                                    {chip.sub}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
