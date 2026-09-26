import React from 'react';
import { School, Users, UserCheck, Rocket } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function HeroBanner() {
    const { user } = useSelector((s) => s.auth);
    const adminName = user?.firstName || 'Aditya';

    return (
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-purple-50/80 border border-blue-100/80 p-6 lg:p-7 shadow-xs overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-200/20 blur-2xl pointer-events-none" />
            <div className="absolute right-60 top-0 w-40 h-40 rounded-full bg-indigo-200/20 blur-xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                {/* Left Text & Stats */}
                <div className="max-w-xl space-y-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 font-display tracking-tight">
                            Welcome back, {adminName}! 👋
                        </h1>
                        <p className="text-xs lg:text-sm text-slate-700 mt-1 font-semibold">
                            You're building a better future for thousands of students.
                        </p>
                    </div>

                    {/* Stat Badges Row matching Image 1 */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold border border-blue-300 shadow-2xs">
                            <School size={13} className="text-blue-700" strokeWidth={2.5} />
                            <span>156 Schools</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-300 shadow-2xs">
                            <Users size={13} className="text-emerald-700" strokeWidth={2.5} />
                            <span>48K+ Students</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-900 text-xs font-extrabold border border-purple-300 shadow-2xs">
                            <UserCheck size={13} className="text-purple-700" strokeWidth={2.5} />
                            <span>3.8K Staff</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs font-extrabold border border-amber-300 shadow-2xs">
                            <Rocket size={13} className="text-amber-700" strokeWidth={2.5} />
                            <span>Growing Together</span>
                        </div>
                    </div>
                </div>

                {/* Right School Campus Photo & Slogan matching Image 1 */}
                <div className="relative shrink-0 hidden md:block">
                    <div className="relative w-72 h-36 lg:w-84 lg:h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-slate-200/60 bg-slate-900 group">
                        <img
                            src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80"
                            alt="PrimeSchool Campus"
                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Motto overlay on architectural wall */}
                        <div className="absolute top-2.5 right-3 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/30 text-right">
                            <p className="text-[8px] font-black tracking-widest text-amber-300 uppercase">
                                "EDUCATE EMPOWER EVOLVE"
                            </p>
                        </div>

                        {/* Slogan in cursive style */}
                        <div className="absolute bottom-2.5 left-3 right-3 text-left">
                            <p className="text-xs font-semibold text-white tracking-wide drop-shadow-md">
                                Empowering Schools
                            </p>
                            <p className="text-[11px] font-medium text-amber-300 drop-shadow-md italic">
                                Building Brighter Futures
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
