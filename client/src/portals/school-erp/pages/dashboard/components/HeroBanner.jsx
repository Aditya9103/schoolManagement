import React, { useState, useEffect } from 'react';
import { Sun, Clock, Sparkles } from 'lucide-react';

export default function HeroBanner({ school, user, adminUser }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const currentUser = user || adminUser;
    const adminName = currentUser?.firstName || 'Rohit';

    const hours = currentTime.getHours();
    const greeting =
        hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';

    const formattedDate = currentTime.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const formattedClock = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const schoolName = school?.name || 'Greenwood International School';
    const schoolCity = school?.address?.city ? `${school.address.city}, India` : 'Delhi, India';
    const schoolTagline = school?.tagline || 'Nurturing Future Leaders';
    const bannerUrl =
        school?.coverImageUrl ||
        school?.bannerUrl ||
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=80';

    return (
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#0a192f] via-[#0f274a] to-[#061122] text-white shadow-lg border border-slate-800/80">
            {/* Background Graphic / Campus Cover Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={bannerUrl}
                    alt={schoolName}
                    className="w-full h-full object-cover object-center opacity-30 transform scale-105 hover:scale-100 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#061122]/95 via-[#0a192f]/85 to-transparent" />
                <div className="absolute inset-0 bg-radial-at-t from-blue-600/20 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 p-5 sm:p-6 lg:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                {/* Left: Salutation & Quote */}
                <div className="max-w-xl space-y-2.5">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight font-display text-white">
                        {greeting}, {adminName}! 👋
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                        Here's what's happening at <span className="font-bold text-white underline decoration-blue-500 decoration-2 underline-offset-4">{schoolName}</span> today.
                    </p>

                    {/* Quotation chip */}
                    <div className="pt-0.5">
                        <p className="text-[11px] sm:text-xs text-blue-200/90 italic bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 inline-block">
                            &ldquo;Education is not preparation for life; education is life itself.&rdquo; <span className="text-slate-300 not-italic font-semibold">— John Dewey</span>
                        </p>
                    </div>
                </div>

                {/* Right: Tagline script & Weather / Live Clock Card */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2.5 shrink-0">
                    {/* Calligraphy Tagline */}
                    <div className="hidden sm:block text-right">
                        <span className="font-serif italic text-base sm:text-lg text-amber-300 tracking-wide drop-shadow-sm font-semibold">
                            {schoolTagline}
                        </span>
                    </div>

                    {/* Weather & Live Clock Pill Container */}
                    <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-white/10 shadow-inner">
                        {/* Weather */}
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/5 border border-white/5">
                            <Sun className="h-4 w-4 text-amber-400 shrink-0 animate-spin-slow" />
                            <div className="text-left">
                                <p className="text-[9px] text-slate-700 font-extrabold font-semibold uppercase tracking-wider leading-none">
                                    {schoolCity}
                                </p>
                                <p className="text-xs font-extrabold text-white mt-0.5 leading-none">
                                    28°C <span className="text-[10px] font-normal text-slate-300">Sunny</span>
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-px bg-white/10" />

                        {/* Live Digital Clock */}
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/5 border border-white/5">
                            <Clock className="h-4 w-4 text-blue-400 shrink-0" />
                            <div className="text-left">
                                <p className="text-[9px] text-slate-700 font-extrabold font-semibold uppercase tracking-wider leading-none">
                                    {formattedDate}
                                </p>
                                <p className="text-xs font-mono font-extrabold text-white mt-0.5 leading-none">
                                    {formattedClock}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
