import React from 'react';
import ParentHeader from './components/ParentHeader';
import StudentCard from './components/StudentCard';
import QuickActionsGrid from './components/QuickActionsGrid';
import UpdatesFeed from './components/UpdatesFeed';

export default function HomePage() {
    return (
        <div className="flex-1 overflow-y-auto bg-slate-950">
            <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 px-5 pt-6 pb-6 space-y-4">
                <ParentHeader />
                <StudentCard />
            </div>
            <div className="px-5 py-4 space-y-6">
                <QuickActionsGrid />
                <UpdatesFeed />
            </div>
        </div>
    );
}
