import React from 'react';
import { useSelector } from 'react-redux';
import { Bell } from 'lucide-react';

export default function DriverHeader() {
    const { user } = useSelector((s) => s.auth);
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-orange-300 text-xs font-medium">Drive Safe 🚌</p>
                <h1 className="text-xl font-extrabold text-white font-display mt-0.5">
                    Hey, {user?.firstName || 'Driver'} 👋
                </h1>
                <p className="text-slate-700 font-medium text-xs mt-0.5">Monday, 22 September 2026</p>
            </div>
            <button className="relative h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700">
                <Bell size={18} className="text-slate-600 font-medium" />
            </button>
        </div>
    );
}
