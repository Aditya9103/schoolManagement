import React, { useState, useEffect } from 'react';
import { X, Wallet, CheckCircle2, AlertCircle, Loader2, ArrowRight, User, Hash } from 'lucide-react';
import { useCollectFeePaymentMutation, useGetFeeAllocationsQuery } from '../../../../../store/api/feeApi';

export default function CollectFeeModal({ isOpen, onClose, preselectedAllocation, onSuccess }) {
    const [selectedAllocId, setSelectedAllocId] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [transactionReference, setTransactionReference] = useState('');
    const [remarks, setRemarks] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [studentSearch, setStudentSearch] = useState('');

    const { data: allocationsRes, isLoading: allocLoading } = useGetFeeAllocationsQuery({
        search: studentSearch,
        limit: 25,
    }, { skip: !isOpen });

    const [collectFeePayment, { isLoading: isSubmitting }] = useCollectFeePaymentMutation();

    const allocations = allocationsRes?.data?.allocations || [];

    useEffect(() => {
        if (preselectedAllocation) {
            setSelectedAllocId(preselectedAllocation._id);
            setAmount(String(preselectedAllocation.balanceAmount || ''));
        } else if (allocations.length > 0 && !selectedAllocId) {
            const firstUnpaid = allocations.find((a) => a.balanceAmount > 0) || allocations[0];
            setSelectedAllocId(firstUnpaid._id);
            setAmount(String(firstUnpaid.balanceAmount || ''));
        }
    }, [preselectedAllocation, allocations]);

    const activeAlloc = allocations.find((a) => a.toString() === selectedAllocId || a._id === selectedAllocId) || preselectedAllocation;

    const handleAllocationSelect = (alloc) => {
        setSelectedAllocId(alloc._id);
        setAmount(String(alloc.balanceAmount || ''));
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!selectedAllocId) {
            setErrorMsg('Please select a student account to collect fee for');
            return;
        }

        const numAmount = Number(amount);
        if (!numAmount || numAmount <= 0) {
            setErrorMsg('Please enter a valid payment amount');
            return;
        }

        if (activeAlloc && numAmount > activeAlloc.balanceAmount) {
            setErrorMsg(`Amount cannot exceed outstanding balance of ₹${activeAlloc.balanceAmount.toLocaleString('en-IN')}`);
            return;
        }

        try {
            const res = await collectFeePayment({
                allocationId: selectedAllocId,
                amount: numAmount,
                paymentMethod,
                transactionReference,
                remarks,
            }).unwrap();

            const s = activeAlloc?.studentId;
            const studentName = s
                ? `${s.firstName || s.personalInfo?.firstName || ''} ${s.lastName || s.personalInfo?.lastName || ''}`.trim() || 'Student'
                : 'Student';

            const receiptPayload = {
                receiptNumber: res.data?.receiptNumber,
                paymentDate: res.data?.transaction?.paymentDate || new Date(),
                studentName,
                admissionNo: s?.admissionNo || '',
                className: activeAlloc?.classId?.name || '',
                sectionName: activeAlloc?.sectionId?.name || '',
                amount: numAmount,
                paymentMethod,
                transactionReference,
                collectedByName: res.data?.transaction?.collectedByName || 'Fee Cashier',
                breakdown: res.data?.transaction?.breakdown || [],
                balanceRemaining: Math.max(0, (activeAlloc?.balanceAmount || 0) - numAmount),
            };

            onSuccess?.(receiptPayload);
            onClose();
        } catch (err) {
            setErrorMsg(err.data?.message || err.message || 'Failed to record payment');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">Offline Fee Collection Desk</h2>
                            <p className="text-xs text-emerald-100">Record cash, UPI, card, or cheque payments & print instant receipt</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                            <AlertCircle size={15} />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Student Selection if not preselected */}
                    {!preselectedAllocation ? (
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700">Select Student Account *</label>
                            <input
                                type="text"
                                placeholder="Search by student name or admission no..."
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 mb-2"
                            />
                            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                                {allocLoading ? (
                                    <div className="p-4 text-center text-xs text-slate-500">Loading students...</div>
                                ) : allocations.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-slate-500">No student accounts found</div>
                                ) : (
                                    allocations.map((alloc) => {
                                        const s = alloc.studentId;
                                        const sName = s
                                            ? `${s.firstName || s.personalInfo?.firstName || ''} ${s.lastName || s.personalInfo?.lastName || ''}`.trim() || 'Student'
                                            : 'Unknown';
                                        const isSelected = alloc._id === selectedAllocId;
                                        return (
                                            <div
                                                key={alloc._id}
                                                onClick={() => handleAllocationSelect(alloc)}
                                                className={`p-2.5 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                                    isSelected ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                                                }`}
                                            >
                                                <div>
                                                    <span className="font-bold">{sName}</span>
                                                    <span className="text-[11px] text-slate-500 ml-2">
                                                        ({alloc.studentId?.admissionNo || 'N/A'} • {alloc.classId?.name || ''})
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[11px] font-extrabold text-amber-600">
                                                        Due: ₹{(alloc.balanceAmount || 0).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                                    <User size={16} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">
                                        {activeAlloc?.studentId?.firstName || activeAlloc?.studentId?.personalInfo?.firstName} {activeAlloc?.studentId?.lastName || activeAlloc?.studentId?.personalInfo?.lastName}
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-medium">
                                        Adm: {activeAlloc?.studentId?.admissionNo} • {activeAlloc?.classId?.name}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Balance Due</span>
                                <span className="font-mono font-black text-amber-700 text-sm">
                                    ₹{Number(activeAlloc?.balanceAmount || 0).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Amount & Mode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount (₹) *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max={activeAlloc ? activeAlloc.balanceAmount : undefined}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="e.g. 15000"
                                className="w-full text-sm font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                            />
                            {activeAlloc && (
                                <button
                                    type="button"
                                    onClick={() => setAmount(String(activeAlloc.balanceAmount || 0))}
                                    className="text-[10px] text-emerald-700 font-bold hover:underline mt-1 cursor-pointer"
                                >
                                    Pay Full Due (₹{Number(activeAlloc.balanceAmount || 0).toLocaleString('en-IN')})
                                </button>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode *</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                            >
                                <option value="CASH">Cash (Counter)</option>
                                <option value="UPI">UPI / QR Code</option>
                                <option value="CARD">Debit / Credit Card (POS)</option>
                                <option value="NET_BANKING">Net Banking / NEFT</option>
                                <option value="CHEQUE">Demand Draft / Cheque</option>
                            </select>
                        </div>
                    </div>

                    {/* Transaction Reference & Remarks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Ref / Cheque No.</label>
                            <input
                                type="text"
                                value={transactionReference}
                                onChange={(e) => setTransactionReference(e.target.value)}
                                placeholder="e.g. UPI-129482910 or CHQ-004812"
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Remarks / Note</label>
                            <input
                                type="text"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="e.g. Q1 installment paid in cash"
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                            />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedAllocId}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    <span>Processing Payment...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={15} />
                                    <span>Collect & Generate Receipt</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
