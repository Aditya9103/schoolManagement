import React from 'react';
import { Users, BookOpen, CalendarCheck, CreditCard, MessageSquare } from 'lucide-react';

/**
 * LoginHero.jsx — Desktop left branding panel.
 * Clean, high-contrast, pixel-perfect layout matching Target UI:
 * - Brand Logo (/logowithoutbg.png)
 * - "Educate • Manage • Grow • Together" capsule pill
 * - "A Smarter Tomorrow for Every School" headline
 * - Subtitle
 * - 5 Feature icon pills with high-contrast readable labels
 * - Quote bubble pill ("“ Empowering schools to create a better tomorrow. ”")
 * - Platform Stats ("1000+ Schools | 10M+ Students | 98% Satisfaction")
 * Note: "Better Students Brighter Futures" monument is in authSchoolbg.png, no duplicate card needed.
 */

const FEATURES = [
    { label: 'Students', icon: Users, bg: 'bg-[#e8f1fd]', text: 'text-[#1a73e8]' },
    { label: 'Academics', icon: BookOpen, bg: 'bg-[#feebe7]', text: 'text-[#ea4335]' },
    { label: 'Attendance', icon: CalendarCheck, bg: 'bg-[#e6f4ea]', text: 'text-[#34a853]' },
    { label: 'Fees', icon: CreditCard, bg: 'bg-[#fef7e0]', text: 'text-[#f9ab00]' },
    { label: 'Communication', icon: MessageSquare, bg: 'bg-[#e1f5fe]', text: 'text-[#0288d1]' },
];

export default function LoginHero() {
    return (
        <div className="hidden lg:flex flex-col justify-between h-full pt-6 pb-4 px-6 xl:px-10 relative z-10 select-none">
            {/* Top Branding Section (clean white background area) */}
            <div className="space-y-3.5 max-w-lg">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img
                        src="/logowithoutbg.png"
                        alt="PrimeSchoolOs Logo"
                        className="h-16 xl:h-20 w-auto object-contain drop-shadow-xs -ml-1"
                    />
                </div>

                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f1fd] border border-[#d2e3fc] shadow-2xs">
                    <span className="text-[11px] font-semibold text-[#1a73e8] tracking-wide">
                        Educate &nbsp;•&nbsp; Manage &nbsp;•&nbsp; Grow &nbsp;•&nbsp; Together
                    </span>
                </div>

                {/* Headings */}
                <div>
                    <h1 className="text-2xl xl:text-3xl 2xl:text-[38px] font-black text-[#0f172a] tracking-tight leading-[1.14] font-display">
                        A Smarter Tomorrow <br />
                        <span className="text-[#0f172a]">for Every School</span>
                    </h1>
                    <p className="mt-1.5 text-slate-700 text-xs xl:text-sm leading-relaxed max-w-md font-medium">
                        All your school operations in one powerful platform. <br className="hidden sm:inline" />
                        Simple. Secure. Scalable.
                    </p>
                </div>

                {/* Feature Icons Row (sits cleanly on white area above building) */}
                <div className="flex items-center gap-3.5 xl:gap-5 pt-1 pb-1">
                    {FEATURES.map((feat) => {
                        const Icon = feat.icon;
                        return (
                            <div key={feat.label} className="flex flex-col items-center group cursor-default">
                                <div
                                    className={`w-11 h-11 xl:w-12 xl:h-12 rounded-2xl ${feat.bg}${feat.text}flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 border border-slate-100`}
                                >
                                    <Icon size={21} strokeWidth={2.2} />
                                </div>
                                <span className="text-[11px] xl:text-xs font-bold text-slate-900 mt-1.5 tracking-tight">
                                    {feat.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Section: Floating Quote Pill Over Campus Lawn & Stats Row */}
            <div className="mt-auto space-y-3.5 pb-2">
                {/* Floating Quote Bubble (Floats on campus grass beside the stone monument) */}
                <div>
                    <div className="bg-[#0f172a]/90 backdrop-blur-md text-white text-xs xl:text-sm px-5 py-2.5 rounded-full border border-white/25 shadow-xl inline-flex items-center gap-2">
                        <span className="text-blue-400 font-serif text-sm">“</span>
                        <span className="font-semibold text-white tracking-normal">
                            Empowering schools to create a better tomorrow.
                        </span>
                        <span className="text-blue-400 font-serif text-sm">”</span>
                    </div>
                </div>

                {/* Platform Stats Row (Crisp white text with drop shadow matching mockup) */}
                <div className="flex items-center gap-6 xl:gap-8 pt-1">
                    <div>
                        <div className="text-2xl xl:text-3xl font-black text-white font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                            1000+
                        </div>
                        <div className="text-xs font-bold text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                            Schools
                        </div>
                    </div>
                    <div className="h-7 w-px bg-white/40 shadow-xs" />
                    <div>
                        <div className="text-2xl xl:text-3xl font-black text-white font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                            10M+
                        </div>
                        <div className="text-xs font-bold text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                            Students
                        </div>
                    </div>
                    <div className="h-7 w-px bg-white/40 shadow-xs" />
                    <div>
                        <div className="text-2xl xl:text-3xl font-black text-white font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                            98%
                        </div>
                        <div className="text-xs font-bold text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                            Satisfaction
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
