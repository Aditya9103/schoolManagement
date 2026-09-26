/**
 * Staff App — Home Page.
 * Imports all components from ./components/
 */
import React from 'react';
import GreetingHeader from './components/GreetingHeader';
import StatsStrip from './components/StatsStrip';
import QuickActionsGrid from './components/QuickActionsGrid';
import TodaySchedule from './components/TodaySchedule';

export default function HomePage() {
    return (
        <div className="flex-1 overflow-y-auto bg-slate-950">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 px-5 pt-6 pb-5 space-y-5">
                <GreetingHeader />
                <StatsStrip />
            </div>
            <div className="px-5 py-4 space-y-6">
                <QuickActionsGrid />
                <TodaySchedule />
            </div>
        </div>
    );
}
