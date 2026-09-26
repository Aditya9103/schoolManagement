import React from 'react';
import { useSelector } from 'react-redux';
import { Bell } from 'lucide-react';

export default function GreetingHeader() {
    const { user } = useSelector((s) => s.auth);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    const initials = `${user?.firstName?.[0] || 'T'}${user?.lastName?.[0] || ''}`;
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-600 font-semibold text-xs font-medium">Mon, 22 September 2026</p>
                <h1 className="text-xl font-extrabold text-white mt-0.5 font-display">
                    {greeting}, {user?.firstName || 'Teacher'} 👋
                </h1>
                <p className="text-slate-700 font-medium text-xs mt-0.5">Mathematics · Class 8A Mentor</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <button className="relative h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700">
                    <Bell size={17} className="text-slate-600 font-medium" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
                </button>
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-emerald-500/30">
                    {initials}
                </div>
            </div>
        </div>
    );
}
