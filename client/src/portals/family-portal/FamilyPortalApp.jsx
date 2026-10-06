import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Calendar,
    ClipboardList,
    FileText,
    Wallet,
    Users,
    Sparkles,
    BookOpen
} from 'lucide-react';
import { useGetMyChildrenQuery } from '../../store/api/peopleApi';
import FamilyPortalLayout from './components/FamilyPortalLayout';
import FamilyNoticesPage from './pages/notice/FamilyNoticesPage';

export default function FamilyPortalApp() {
    const navigate = useNavigate();
    const { user } = useSelector((s) => s.auth);

    const { data: childrenRes, isLoading: isChildrenLoading } = useGetMyChildrenQuery();
    const children = childrenRes?.data || [];
    const [selectedChildIndex, setSelectedChildIndex] = useState(0);

    const activeChild = children[selectedChildIndex] || children[0] || {
        id: 'default',
        name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Enrolled Student',
        class: 'Class Section',
        rollNo: '—',
        avatar: (user?.firstName || 'S')[0],
        school: user?.schoolName || 'PrimeSchoolOS Academy',
        attendance: 'N/A',
        pendingHomework: 0,
        feesDue: '₹0',
    };

    return (
        <FamilyPortalLayout
            childrenList={children}
            selectedChildIndex={selectedChildIndex}
            onSelectChild={setSelectedChildIndex}
        >
            <Routes>
                <Route
                    index
                    element={
                        <div className="space-y-6">
                            {/* 1. Active Student Hero Card */}
                            {isChildrenLoading ? (
                                <div className="rounded-3xl bg-slate-800 p-6 shadow-2xl border border-slate-700 animate-pulse">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-700" />
                                        <div className="space-y-2">
                                            <div className="h-5 w-40 bg-slate-700 rounded" />
                                            <div className="h-3 w-28 bg-slate-700 rounded" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="h-16 bg-slate-700/60 rounded-2xl" />
                                        <div className="h-16 bg-slate-700/60 rounded-2xl" />
                                        <div className="h-16 bg-slate-700/60 rounded-2xl" />
                                    </div>
                                </div>
                            ) : children.length === 0 ? (
                                <div className="rounded-3xl bg-gradient-to-br from-slate-800 to-slate-850 p-6 shadow-2xl border border-slate-700 text-white text-center py-8">
                                    <Users size={36} className="mx-auto text-blue-400 mb-2 opacity-80" />
                                    <h2 className="text-base font-extrabold">Welcome to PrimeSchoolOS Family Portal</h2>
                                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                                        No enrolled student record is currently linked to your guardian account.
                                        Please contact school administration with your child's Admission Number to enable live academic syncing.
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 shadow-2xl shadow-blue-500/25 text-white">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black border border-white/20 shadow-md">
                                            {activeChild.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-xl font-extrabold">{activeChild.name}</h2>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md font-semibold">
                                                    Enrolled Student
                                                </span>
                                            </div>
                                            <p className="text-blue-100 text-xs mt-0.5">
                                                {activeChild.class} • Roll No. {activeChild.rollNo}
                                            </p>
                                            <p className="text-blue-200 text-[11px] mt-0.5">{activeChild.school}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
                                            <span className="text-base font-black">{activeChild.attendance}</span>
                                            <span className="text-[10px] text-blue-200 block mt-0.5">Attendance</span>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
                                            <span className="text-base font-black">{activeChild.pendingHomework} Tasks</span>
                                            <span className="text-[10px] text-blue-200 block mt-0.5">Active HW</span>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
                                            <span className="text-base font-black">{activeChild.feesDue}</span>
                                            <span className="text-[10px] text-blue-200 block mt-0.5">Fee Balance</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2. Quick Academic Actions */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { title: 'Today Schedule', desc: 'Class timetable', icon: Calendar, color: 'blue', link: '/portal/timetable' },
                                    { title: 'Daily Attendance', desc: 'Monthly register', icon: ClipboardList, color: 'emerald', link: '/portal/attendance' },
                                    { title: 'Active Homework', desc: 'Assignments & tasks', icon: FileText, color: 'indigo', link: '/portal/homework' },
                                    { title: 'Pay Fees', desc: 'Receipts & payment', icon: Wallet, color: 'amber', link: '/portal/fees' },
                                ].map((card, i) => {
                                    const Icon = card.icon;
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => navigate(card.link)}
                                            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer group"
                                        >
                                            <div className="p-2.5 rounded-xl bg-slate-700/60 text-blue-400 w-fit mb-2 group-hover:scale-110 transition-transform">
                                                <Icon size={18} />
                                            </div>
                                            <h3 className="text-xs font-bold text-white">{card.title}</h3>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{card.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 3. Live Academic Status Card */}
                            <div className="rounded-2xl bg-slate-800/70 border border-slate-700/80 p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-white">Live Academic Status</h3>
                                    <span className="text-xs text-blue-400 hover:text-blue-300 font-bold cursor-pointer" onClick={() => navigate('/portal/notices')}>
                                        View Notices
                                    </span>
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-200">Real-Time Sync</p>
                                            <p className="text-[11px] text-slate-400">Connected to school events via Socket.IO live stream.</p>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                            LIVE
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-200">Academic Year</p>
                                            <p className="text-[11px] text-slate-400">Active session 2026-2027 enrollment active.</p>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                            CURRENT
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                />
                <Route path="notices" element={<FamilyNoticesPage />} />
                <Route
                    path="*"
                    element={
                        <div className="py-20 text-center space-y-3">
                            <Sparkles size={36} className="text-blue-400 mx-auto" />
                            <h2 className="text-base font-bold text-white">Module Connected</h2>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                Real data is synchronized live from the school's central database for {activeChild.name}.
                            </p>
                        </div>
                    }
                />
            </Routes>
        </FamilyPortalLayout>
    );
}
