import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import DriverHeader from './components/DriverHeader';
import BusCard from './components/BusCard';
import RouteCard from './components/RouteCard';
import StartTripButton from './components/StartTripButton';
import QuickActionsGrid from './components/QuickActionsGrid';

export default function HomePage() {
    const [tripActive, setTripActive] = useState(false);
    return (
        <div className="flex-1 overflow-y-auto bg-slate-950">
            <div className="bg-gradient-to-b from-orange-950 via-slate-900 to-slate-950 px-5 pt-6 pb-6 space-y-4">
                <DriverHeader />
                <BusCard />
                <RouteCard />
            </div>
            <div className="px-5 py-4 space-y-4">
                <StartTripButton active={tripActive} onToggle={() => setTripActive((v) => !v)} />
                <QuickActionsGrid />
                {/* Safety Card */}
                <div className="rounded-2xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 p-4">
                    <div className="flex items-center gap-3">
                        <Shield size={24} className="text-emerald-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-white">Drive Safe Today 🙏</p>
                            <p className="text-xs text-slate-600 font-semibold mt-0.5">42 students trust you. Follow all traffic rules.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
