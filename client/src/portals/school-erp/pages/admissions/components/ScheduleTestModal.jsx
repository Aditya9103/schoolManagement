import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, FileText, Send, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useScheduleTestMutation } from '../../../../../store/api/admissionsApi';

export default function ScheduleTestModal({ application, onClose }) {
    const [scheduleTest, { isLoading }] = useScheduleTestMutation();

    const [testType, setTestType] = useState('WRITTEN');
    const [scheduledDate, setScheduledDate] = useState('2026-09-28');
    const [scheduledTime, setScheduledTime] = useState('10:00 AM');
    const [venue, setVenue] = useState('Main Campus, Block A');
    const [examinerName, setExaminerName] = useState('Dr. Priya Sharma');
    const [maxMarks, setMaxMarks] = useState(100);
    const [instructions, setInstructions] = useState('Please carry admit card, pen, and original birth certificate.');
    const [sendNotification, setSendNotification] = useState(true);

    if (!application) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await scheduleTest({
                id: application._id,
                type: testType,
                scheduledDate,
                scheduledTime,
                venue,
                examinerName,
                maxMarks: Number(maxMarks),
                instructions,
                sendNotification,
            }).unwrap();

            toast.success(`Entrance assessment scheduled for ${application.student?.firstName}!`);
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to schedule entrance test');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                            Entrance Assessment
                        </span>
                        <h3 className="text-lg font-black text-slate-900">
                            Schedule Test / Interview
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-600 font-medium hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                    <div>
                        <span className="text-slate-500 block">Candidate:</span>
                        <span className="font-bold text-slate-900">{application.student?.firstName} {application.student?.lastName}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-slate-500 block">Class Applied:</span>
                        <span className="font-bold text-blue-700">{application.targetClassName}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                    {/* Test Type Pills */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Assessment Format *</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'WRITTEN', label: 'Written Test' },
                                { id: 'INTERVIEW', label: 'Interview' },
                                { id: 'BOTH', label: 'Both' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setTestType(t.id)}
                                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                        testType === t.id
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Date *</label>
                            <input
                                type="date"
                                required
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Time Slot *</label>
                            <input
                                type="text"
                                placeholder="10:00 AM - 11:30 AM"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Venue / Room *</label>
                            <input
                                type="text"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs outline-hidden"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Examiner / Panel</label>
                            <input
                                type="text"
                                value={examinerName}
                                onChange={(e) => setExaminerName(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs outline-hidden"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Maximum Marks</label>
                        <input
                            type="number"
                            value={maxMarks}
                            onChange={(e) => setMaxMarks(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Instructions for Candidate / Parents</label>
                        <textarea
                            rows={2}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs outline-hidden resize-none"
                        />
                    </div>

                    {/* Checkbox notification */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="notifyParent"
                            checked={sendNotification}
                            onChange={(e) => setSendNotification(e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer"
                        />
                        <label htmlFor="notifyParent" className="text-xs text-slate-800 font-bold cursor-pointer select-none">
                            Send Notification to Parent via SMS and Email
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send size={14} />
                                    <span>Schedule Test</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
