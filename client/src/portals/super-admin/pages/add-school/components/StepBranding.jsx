import React from 'react';
import { ArrowLeft, ArrowRight, Check, Palette, Sparkles } from 'lucide-react';

const THEMES = [
    {
        id: 'MODERN',
        name: 'Modern',
        desc: 'Deep blue & vibrant indigo tones for tech-enabled schools',
        primary: '#2563EB',
        secondary: '#3B82F6',
        accent: '#F59E0B',
    },
    {
        id: 'ACADEMIC',
        name: 'Academic',
        desc: 'Classic forest emerald and gold accents for prestigious heritage academies',
        primary: '#059669',
        secondary: '#10B981',
        accent: '#D97706',
    },
    {
        id: 'VIBRANT',
        name: 'Vibrant',
        desc: 'Energizing purple, rose, and amber tones for creative learning hubs',
        primary: '#7C3AED',
        secondary: '#EC4899',
        accent: '#F59E0B',
    },
    {
        id: 'MINIMAL',
        name: 'Minimal',
        desc: 'Contemporary monochrome slate and crisp white for progressive campuses',
        primary: '#0F172A',
        secondary: '#475569',
        accent: '#2563EB',
    },
];

export default function StepBranding({ form, onChange, onNext, onBack }) {
    const activeTheme = form.theme || 'MODERN';

    const handleSelectTheme = (theme) => {
        onChange('theme', theme.id);
        onChange('primaryColor', theme.primary);
        onChange('secondaryColor', theme.secondary);
        onChange('accentColor', theme.accent);
    };

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
            <div>
                <h3 className="text-lg font-black text-slate-900 font-display">School Branding & Appearance</h3>
                <p className="text-xs font-medium text-slate-600 mt-0.5">Customize the color scheme and visual theme for this school portal.</p>
            </div>

            {/* Brand Colors Row */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Palette size={15} className="text-blue-600" />
                    Brand Colors
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Primary Color */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 shadow-2xs">
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            Primary Color
                        </label>
                        <div className="flex items-center gap-2.5">
                            <input
                                type="color"
                                value={form.primaryColor || '#2563EB'}
                                onChange={(e) => onChange('primaryColor', e.target.value)}
                                className="h-9 w-9 rounded-xl cursor-pointer border border-slate-300 bg-white p-0.5"
                            />
                            <input
                                type="text"
                                value={form.primaryColor || '#2563EB'}
                                onChange={(e) => onChange('primaryColor', e.target.value)}
                                className="w-full h-9 px-3 text-xs font-bold border border-slate-300 rounded-xl font-mono uppercase bg-white text-slate-900"
                            />
                        </div>
                    </div>

                    {/* Secondary Color */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 shadow-2xs">
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            Secondary Color
                        </label>
                        <div className="flex items-center gap-2.5">
                            <input
                                type="color"
                                value={form.secondaryColor || '#10B981'}
                                onChange={(e) => onChange('secondaryColor', e.target.value)}
                                className="h-9 w-9 rounded-xl cursor-pointer border border-slate-300 bg-white p-0.5"
                            />
                            <input
                                type="text"
                                value={form.secondaryColor || '#10B981'}
                                onChange={(e) => onChange('secondaryColor', e.target.value)}
                                className="w-full h-9 px-3 text-xs font-bold border border-slate-300 rounded-xl font-mono uppercase bg-white text-slate-900"
                            />
                        </div>
                    </div>

                    {/* Accent Color */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 shadow-2xs">
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            Accent Color
                        </label>
                        <div className="flex items-center gap-2.5">
                            <input
                                type="color"
                                value={form.accentColor || '#F59E0B'}
                                onChange={(e) => onChange('accentColor', e.target.value)}
                                className="h-9 w-9 rounded-xl cursor-pointer border border-slate-300 bg-white p-0.5"
                            />
                            <input
                                type="text"
                                value={form.accentColor || '#F59E0B'}
                                onChange={(e) => onChange('accentColor', e.target.value)}
                                className="w-full h-9 px-3 text-xs font-bold border border-slate-300 rounded-xl font-mono uppercase bg-white text-slate-900"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Choose a Theme Preview */}
            <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles size={15} className="text-amber-800 font-bold" />
                    Choose a Theme Preset
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {THEMES.map((th) => {
                        const isSelected = activeTheme === th.id;
                        return (
                            <div
                                key={th.id}
                                onClick={() => handleSelectTheme(th)}
                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                                    isSelected
                                        ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20'
                                        : 'border-slate-300 hover:border-slate-400 bg-white shadow-2xs'
                                }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                )}

                                <div>
                                    {/* Mock Mini Theme Preview Bar */}
                                    <div className="h-10 rounded-xl overflow-hidden mb-3 border border-slate-200 flex shadow-inner">
                                        <div className="w-1/3 h-full" style={{ backgroundColor: th.primary }} />
                                        <div className="w-1/3 h-full" style={{ backgroundColor: th.secondary }} />
                                        <div className="w-1/3 h-full" style={{ backgroundColor: th.accent }} />
                                    </div>

                                    <h5 className="text-xs font-bold text-slate-900">{th.name}</h5>
                                    <p className="text-[11px] text-slate-600 mt-1 leading-snug font-medium">{th.desc}</p>
                                </div>

                                <div className="mt-3.5 pt-2 border-t border-slate-200 flex items-center gap-1.5">
                                    <span
                                        className="h-2.5 w-2.5 rounded-full border border-slate-300"
                                        style={{ backgroundColor: th.primary }}
                                    />
                                    <span className="text-[10px] font-mono font-bold text-slate-600">
                                        {th.primary}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 h-11 px-5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 text-xs transition-all shadow-xs"
                >
                    <ArrowLeft size={15} /> Back
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="flex items-center gap-2 h-11 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all"
                >
                    Next Step <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
