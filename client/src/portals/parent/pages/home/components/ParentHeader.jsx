import React from 'react';
import { useSelector } from 'react-redux';
import { Bell } from 'lucide-react';

export default function ParentHeader() {
    const { user } = useSelector((s) => s.auth);
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-600 font-semibold text-xs">Hello, {user?.firstName || 'Parent'} 👋</p>
                <h1 className="text-xl font-extrabold text-white font-display mt-0.5">My Children</h1>
            </div>
            <button className="relative h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700">
                <Bell size={18} className="text-slate-600 font-medium" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-800" />
            </button>
        </div>
    );
}
