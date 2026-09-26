import React, { useState, useEffect } from 'react';
import { X, Clock, Plus, Trash2, Coffee, AlertCircle, Sparkles, Check, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConfigurePeriodsModal({
    isOpen,
    onClose,
    initialPeriods = [],
    onSave,
}) {
    const [periods, setPeriods] = useState([]);

    useEffect(() => {
        if (initialPeriods && initialPeriods.length > 0) {
            setPeriods(initialPeriods.map((p, idx) => ({
                id: p._id || `p-${idx}-${Date.now()}`,
                periodNumber: p.periodNumber || idx + 1,
                name: p.name || (p.isBreak ? 'Recess Break' : `Period ${idx + 1}`),
                startTime: p.startTime || '08:00 AM',
                endTime: p.endTime || '08:45 AM',
                isBreak: !!p.isBreak,
                breakTitle: p.breakTitle || 'Recess',
            })));
        } else {
            // Default 8-period structure
            setPeriods([
                { id: '1', periodNumber: 1, name: 'Period 1', startTime: '08:00 AM', endTime: '08:45 AM', isBreak: false },
                { id: '2', periodNumber: 2, name: 'Period 2', startTime: '08:45 AM', endTime: '09:30 AM', isBreak: false },
                { id: '3', periodNumber: 3, name: 'Period 3', startTime: '09:30 AM', endTime: '10:15 AM', isBreak: false },
                { id: '4', periodNumber: 4, name: 'Period 4', startTime: '10:15 AM', endTime: '11:00 AM', isBreak: false },
                { id: '5', periodNumber: 5, name: 'Recess Break', startTime: '11:00 AM', endTime: '11:30 AM', isBreak: true, breakTitle: 'Recess' },
                { id: '6', periodNumber: 6, name: 'Period 5', startTime: '11:30 AM', endTime: '12:15 PM', isBreak: false },
                { id: '7', periodNumber: 7, name: 'Period 6', startTime: '12:15 PM', endTime: '01:00 PM', isBreak: false },
                { id: '8', periodNumber: 8, name: 'Period 7', startTime: '01:00 PM', endTime: '01:45 PM', isBreak: false },
            ]);
        }
    }, [initialPeriods, isOpen]);

    if (!isOpen) return null;

    const handleAddPeriod = (isBreak = false) => {
        const nextNum = periods.length + 1;
        // Estimate next start & end time
        let nextStart = '02:00 PM';
        let nextEnd = '02:45 PM';
        if (periods.length > 0) {
            const last = periods[periods.length - 1];
            nextStart = last.endTime || '02:00 PM';
        }

        const newPeriod = {
            id: `p-${Date.now()}`,
            periodNumber: nextNum,
            name: isBreak ? 'Break / Recess' : `Period ${nextNum}`,
            startTime: nextStart,
            endTime: nextEnd,
            isBreak,
            breakTitle: isBreak ? 'Recess' : '',
        };
        setPeriods([...periods, newPeriod]);
        toast.success(`Added ${isBreak ? 'Break Slot' : `Period ${nextNum}`}`);
    };

    const handleRemovePeriod = (id) => {
        if (periods.length <= 1) {
            toast.error('Schedule must have at least 1 period');
            return;
        }
        const updated = periods
            .filter((p) => p.id !== id)
            .map((p, idx) => ({ ...p, periodNumber: idx + 1 }));
        setPeriods(updated);
    };

    const handleUpdatePeriod = (id, field, value) => {
        setPeriods((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p;
                const updated = { ...p, [field]: value };
                if (field === 'isBreak' && value === true && !updated.breakTitle) {
                    updated.breakTitle = 'Recess Break';
                }
                return updated;
            })
        );
    };

    const handleSave = () => {
        // Validate
        for (const p of periods) {
            if (!p.startTime || !p.endTime) {
                toast.error(`Please provide valid start and end times for ${p.name || 'all periods'}`);
                return;
            }
        }
        onSave(periods);
        toast.success('Period configurations updated');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
                            <Clock size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">
                                Customize Periods & Bell Schedule
                            </h2>
                            <p className="text-xs text-blue-100 font-medium">
                                Define period counts, timeslots, and make any period a break/recess
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    <div className="flex items-center justify-between text-xs text-slate-700 font-medium font-semibold px-1">
                        <span>Configured Timetable Slots ({periods.length})</span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleAddPeriod(false)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors"
                            >
                                <Plus size={13} />
                                <span>+ Add Period</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleAddPeriod(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold transition-colors"
                            >
                                <Coffee size={13} />
                                <span>+ Add Break / Recess</span>
                            </button>
                        </div>
                    </div>

                    {/* Periods List */}
                    <div className="space-y-3">
                        {periods.map((period, idx) => (
                            <div
                                key={period.id}
                                className={`p-4 rounded-2xl border transition-all ${
                                    period.isBreak
                                        ? 'bg-amber-50/50 border-amber-200 ring-1 ring-amber-300/30'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    {/* Period Badge & Name */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                                                period.isBreak
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-blue-600 text-white'
                                            }`}
                                        >
                                            {period.isBreak ? <Coffee size={16} /> : idx + 1}
                                        </div>

                                        <div className="flex-1 min-w-36">
                                            <input
                                                type="text"
                                                value={period.name}
                                                onChange={(e) => handleUpdatePeriod(period.id, 'name', e.target.value)}
                                                placeholder={period.isBreak ? 'Recess Break' : `Period ${idx + 1}`}
                                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Start & End Times */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-white px-2 py-1 border border-slate-300 rounded-lg">
                                            <span className="text-[10px] text-slate-700 font-extrabold uppercase">From:</span>
                                            <input
                                                type="text"
                                                value={period.startTime}
                                                onChange={(e) => handleUpdatePeriod(period.id, 'startTime', e.target.value)}
                                                placeholder="08:00 AM"
                                                className="w-20 text-xs font-bold text-slate-900 focus:outline-hidden"
                                            />
                                        </div>
                                        <span className="text-slate-600 font-semibold text-xs font-bold">-</span>
                                        <div className="flex items-center gap-1 bg-white px-2 py-1 border border-slate-300 rounded-lg">
                                            <span className="text-[10px] text-slate-700 font-extrabold uppercase">To:</span>
                                            <input
                                                type="text"
                                                value={period.endTime}
                                                onChange={(e) => handleUpdatePeriod(period.id, 'endTime', e.target.value)}
                                                placeholder="08:45 AM"
                                                className="w-20 text-xs font-bold text-slate-900 focus:outline-hidden"
                                            />
                                        </div>
                                    </div>

                                    {/* Break toggle & delete */}
                                    <div className="flex items-center gap-2 justify-end shrink-0">
                                        <label className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200 cursor-pointer text-[11px] font-semibold text-slate-800 font-bold">
                                            <input
                                                type="checkbox"
                                                checked={period.isBreak}
                                                onChange={(e) => handleUpdatePeriod(period.id, 'isBreak', e.target.checked)}
                                                className="w-3.5 h-3.5 rounded-sm border-slate-300 text-amber-800 font-bold focus:ring-amber-500"
                                            />
                                            <span>Break</span>
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => handleRemovePeriod(period.id)}
                                            className="p-1.5 text-slate-600 font-medium hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                            title="Remove Period"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all"
                    >
                        <Check size={15} />
                        <span>Apply Period Timings</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
