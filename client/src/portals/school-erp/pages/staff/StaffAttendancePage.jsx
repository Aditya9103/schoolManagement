import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClipboardList, Users, CheckCircle2, Clock, AlertCircle, Calendar,
    Search, Filter, ChevronLeft, ChevronRight, Download, RefreshCw,
    UserCheck, ArrowLeft, MoreVertical, Edit3, ShieldAlert, ArrowUpRight,
    Sparkles, Check
} from 'lucide-react';
import { useGetEmployeeAttendanceQuery } from '../../../../store/api/peopleApi';
import usePermissions from '../../../../hooks/usePermissions';
import MarkAttendanceModal from './components/MarkAttendanceModal';

export default function StaffAttendancePage() {
    const navigate = useNavigate();
    const { canAccess, hasAction, isAdmin } = usePermissions();

    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        return d.toISOString().split('T')[0];
    });

    const [search, setSearch] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedRole, setSelectedRole] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const [modalEmployee, setModalEmployee] = useState(null);
    const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

    const handlePrevDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    const handleNextDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    const handleToday = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    const queryParams = useMemo(() => ({
        date: selectedDate,
        department: selectedDept !== 'All' ? selectedDept : undefined,
        role: selectedRole !== 'All' ? selectedRole : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined
    }), [selectedDate, selectedDept, selectedRole, selectedStatus]);

    const { data: resData, isLoading, refetch } = useGetEmployeeAttendanceQuery(queryParams);

    const records = resData?.data?.records || [];
    const summary = resData?.data?.summary || {
        present: records.filter(r => r.status === 'PRESENT').length,
        absent: records.filter(r => r.status === 'ABSENT').length,
        late: records.filter(r => r.status === 'LATE').length,
        onLeave: records.filter(r => r.status === 'ON_LEAVE').length,
        notMarked: records.filter(r => r.status === 'NOT_MARKED').length,
        totalEmployees: records.length
    };

    const filteredRecords = useMemo(() => {
        if (!search.trim()) return records;
        const q = search.toLowerCase();
        return records.filter((r) =>
            r.name.toLowerCase().includes(q) ||
            r.employeeId.toLowerCase().includes(q) ||
            r.department.toLowerCase().includes(q) ||
            r.role.toLowerCase().includes(q)
        );
    }, [records, search]);

    const handleOpenEdit = (rec) => {
        setModalEmployee(rec);
        setIsMarkModalOpen(true);
    };

    const formattedDisplayDate = useMemo(() => {
        try {
            const d = new Date(selectedDate + 'T00:00:00');
            return d.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return selectedDate;
        }
    }, [selectedDate]);

    const handleExportCSV = () => {
        const headers = ['Employee ID,Name,Role,Department,Status,Check In,Check Out\n'];
        const rows = filteredRecords.map((r) =>
            `"${r.employeeId}","${r.name}","${r.role}","${r.department}","${r.status}","${r.checkInTime || '-'}","${r.checkOutTime || '-'}"`
        );
        const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `staff-attendance-${selectedDate}.csv`;
        a.click();
    };

    const attendanceRate = summary.totalEmployees > 0
        ? Math.round((summary.present / summary.totalEmployees) * 100)
        : 0;

    const statCards = [
        {
            title: 'Total Personnel',
            value: summary.totalEmployees ?? 0,
            change: null,
            subtext: 'Registered campus staff',
            Icon: Users,
            iconBg: 'bg-blue-100 text-blue-600',
            trendBg: null,
        },
        {
            title: 'Present Today',
            value: summary.present ?? 0,
            change: `${attendanceRate}%`,
            subtext: 'On duty & checked in',
            Icon: CheckCircle2,
            iconBg: 'bg-emerald-100 text-emerald-600',
            trendBg: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        },
        {
            title: 'Late Entries',
            value: summary.late ?? 0,
            change: null,
            subtext: 'Checked in post 09:00 AM',
            Icon: Clock,
            iconBg: 'bg-amber-100 text-amber-600',
            trendBg: null,
        },
        {
            title: 'Absent / On Leave',
            value: (summary.absent || 0) + (summary.onLeave || 0),
            change: null,
            subtext: `${summary.onLeave ?? 0} Leave • ${summary.absent ?? 0} Absent`,
            Icon: AlertCircle,
            iconBg: 'bg-rose-100 text-rose-600',
            trendBg: null,
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-5 lg:p-6 space-y-5 max-w-[1720px] mx-auto pb-16">
            {/* ── Tier 1: Header Hub ─────────────────────────────────────────── */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 mt-0.5 sm:mt-0">
                        <ClipboardList size={22} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={() => navigate('/school/staff')}
                                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                            >
                                <ArrowLeft size={13} />
                                Staff Management
                            </button>
                            <span className="text-slate-300">/</span>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                                Attendance Register
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                                {attendanceRate}% Attendance Rate
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                            Daily punch management, check-in timestamps, monthly attendance tracking, and duty logs.
                        </p>
                    </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-300 shadow-2xs hover:border-slate-400 active:scale-95 cursor-pointer"
                    >
                        <Download size={15} className="text-slate-600" />
                        <span>Export CSV</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="p-2.5 text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs hover:border-slate-400 cursor-pointer"
                        title="Refresh register"
                    >
                        <RefreshCw size={15} />
                    </button>
                </div>
            </div>

            {/* ── Tier 2: Date Navigation Card (Attendance Hub style) ─────────── */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shrink-0">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                            Attendance Register Date
                        </span>
                        <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
                            {formattedDisplayDate}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handlePrevDay}
                        className="p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                        title="Previous Day"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3.5 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs cursor-pointer"
                    />
                    <button
                        type="button"
                        onClick={handleNextDay}
                        className="p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                        title="Next Day"
                    >
                        <ChevronRight size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={handleToday}
                        className="px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors ml-1 cursor-pointer"
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* ── Tier 3: 4-Card Stats Summary Row ────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {statCards.map((card) => {
                    const { Icon } = card;
                    return (
                        <div
                            key={card.title}
                            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between gap-1.5 mb-2">
                                <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${card.iconBg}`}>
                                    <Icon size={20} />
                                </div>
                                {card.change && (
                                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.trendBg}`}>
                                        <ArrowUpRight size={10} />
                                        {card.change}
                                    </span>
                                )}
                            </div>

                            <div>
                                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                                    {card.value}
                                </p>
                                <p className="text-xs font-bold text-slate-600 mt-0.5">
                                    {card.title}
                                </p>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-semibold truncate">
                                {card.subtext}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Tier 4: Filters Toolbar ─────────────────────────────────────── */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Filter by employee name, ID, department..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-500 shadow-2xs transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="px-3.5 py-2.5 bg-slate-50 hover:bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-colors cursor-pointer"
                        >
                            <option value="All">All Departments</option>
                            <option value="Administration">Administration</option>
                            <option value="Accounts">Accounts & Finance</option>
                            <option value="Library">Library</option>
                            <option value="Science Lab">Science Lab</option>
                            <option value="Security">Security & Facilities</option>
                            <option value="Medical">Medical</option>
                            <option value="Transport">Transport</option>
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3.5 py-2.5 bg-slate-50 hover:bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-colors cursor-pointer"
                        >
                            <option value="All">All Attendance Statuses</option>
                            <option value="PRESENT">Present</option>
                            <option value="LATE">Late Entry</option>
                            <option value="ON_LEAVE">On Leave</option>
                            <option value="ABSENT">Absent</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Tier 5: Attendance Register Table ───────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                {isLoading ? (
                    <div className="p-16 text-center text-slate-400 text-xs">
                        <RefreshCw size={28} className="animate-spin mx-auto mb-2 text-blue-600" />
                        <span className="font-bold text-slate-700">Loading daily attendance register...</span>
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="p-16 text-center space-y-3">
                        <ClipboardList size={36} className="text-slate-300 mx-auto" />
                        <h3 className="text-sm font-bold text-slate-900">No attendance entries found</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                            No employees match your selected date or filter criteria.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-700 text-[11px] font-extrabold uppercase tracking-wider">
                                    <th className="py-3.5 px-4">Employee</th>
                                    <th className="py-3.5 px-4">Department & Role</th>
                                    <th className="py-3.5 px-4">Check-In</th>
                                    <th className="py-3.5 px-4">Check-Out</th>
                                    <th className="py-3.5 px-4">Monthly Record</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRecords.map((r) => {
                                    const isPresent = r.status === 'PRESENT';
                                    const isLate = r.status === 'LATE';
                                    const isOnLeave = r.status === 'ON_LEAVE';
                                    const isAbsent = r.status === 'ABSENT';

                                    return (
                                        <tr key={r.id || r.employeeId} className="hover:bg-blue-50/40 transition-colors">
                                            {/* Employee */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600 border border-slate-200 shadow-2xs">
                                                        {r.avatar ? (
                                                            <img src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            r.name?.charAt(0) || 'E'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm">{r.name}</div>
                                                        <div className="text-[11px] font-mono font-bold text-slate-500">{r.employeeId}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Department & Role */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-slate-900">{r.role}</div>
                                                <div className="text-[11px] text-slate-500 font-semibold">{r.department}</div>
                                            </td>

                                            {/* Check-In */}
                                            <td className="py-3.5 px-4">
                                                {r.checkInTime ? (
                                                    <span className={`inline-flex items-center gap-1 font-bold ${isLate ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200' : 'text-slate-800'}`}>
                                                        <Clock size={12} className="text-slate-400" />
                                                        {r.checkInTime}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>

                                            {/* Check-Out */}
                                            <td className="py-3.5 px-4">
                                                {r.checkOutTime ? (
                                                    <span className="inline-flex items-center gap-1 text-slate-800 font-bold">
                                                        <Clock size={12} className="text-slate-400" />
                                                        {r.checkOutTime}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>

                                            {/* Monthly Record */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-1.5 text-[11px]">
                                                    <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                                                        P: {r.presentDays || 26}
                                                    </span>
                                                    <span className="text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md font-bold border border-rose-200">
                                                        A: {r.absentDays || 0}
                                                    </span>
                                                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-bold border border-amber-200">
                                                        L: {r.lateDays || 0}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-3.5 px-4">
                                                {isPresent && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        Present
                                                    </span>
                                                )}
                                                {isLate && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                        Late Entry
                                                    </span>
                                                )}
                                                {isOnLeave && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                        On Leave
                                                    </span>
                                                )}
                                                {isAbsent && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                        Absent
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEdit(r)}
                                                    className="px-3 py-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200/80 transition-all inline-flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Edit3 size={13} />
                                                    Edit Punch
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            <MarkAttendanceModal
                isOpen={isMarkModalOpen}
                onClose={() => setIsMarkModalOpen(false)}
                employee={modalEmployee}
                defaultDate={selectedDate}
                onSuccess={() => refetch()}
            />
        </div>
    );
}
