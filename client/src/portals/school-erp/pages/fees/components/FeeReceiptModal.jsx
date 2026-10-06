import React, { useRef } from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download, School } from 'lucide-react';

export default function FeeReceiptModal({ isOpen, onClose, receiptData }) {
    const printRef = useRef(null);

    if (!isOpen || !receiptData) return null;

    const {
        receiptNumber = 'REC-2026-0001',
        paymentDate = new Date(),
        studentName = '',
        admissionNo = '',
        className = '',
        sectionName = '',
        amount = 0,
        paymentMethod = 'CASH',
        transactionReference = '',
        collectedByName = 'Accounts Desk',
        breakdown = [],
        balanceRemaining = 0,
        schoolName = 'PrimeSchoolOS International Academy',
    } = receiptData;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Top Actions */}
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-400" />
                        <span className="text-sm font-bold tracking-wide">Official Fee Receipt</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                            <Printer size={14} />
                            <span>Print Receipt</span>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Printable Receipt Paper */}
                <div ref={printRef} className="p-8 space-y-6 text-slate-800 bg-white">
                    {/* Header */}
                    <div className="text-center pb-5 border-b border-slate-200">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 mb-2 font-black">
                            <School size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight font-display">
                            {schoolName}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">Affiliated to Central Board of Secondary Education • Reg. # CBSE-2026</p>
                        <div className="inline-block mt-3 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700 border border-slate-200">
                            FEE PAYMENT RECEIPT (OFFICE & STUDENT COPY)
                        </div>
                    </div>

                    {/* Metadata Strip */}
                    <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div>
                            <span className="text-slate-500 font-semibold block">Receipt Number:</span>
                            <span className="font-mono font-black text-slate-900 text-sm">{receiptNumber}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-slate-500 font-semibold block">Payment Date & Time:</span>
                            <span className="font-bold text-slate-900">
                                {new Date(paymentDate).toLocaleString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-500 font-semibold block">Student Name:</span>
                            <span className="font-bold text-slate-900 text-sm">{studentName}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-slate-500 font-semibold block">Admission No / Class:</span>
                            <span className="font-bold text-slate-900">
                                {admissionNo} • {className} {sectionName ? `(${sectionName})` : ''}
                            </span>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div>
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="py-2">Fee Head / Description</th>
                                    <th className="py-2 text-right">Amount Paid</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {breakdown && breakdown.length > 0 ? (
                                    breakdown.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-2.5 font-medium text-slate-700">{item.name}</td>
                                            <td className="py-2.5 text-right font-bold text-slate-900">
                                                ₹ {Number(item.amountPaid).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="py-2.5 font-medium text-slate-700">School Tuition & Academic Dues</td>
                                        <td className="py-2.5 text-right font-bold text-slate-900">
                                            ₹ {Number(amount).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-slate-900">
                                    <td className="py-3 font-black text-slate-900 text-sm">Total Amount Paid:</td>
                                    <td className="py-3 text-right font-black text-blue-600 text-base">
                                        ₹ {Number(amount).toLocaleString('en-IN')}
                                    </td>
                                </tr>
                                {balanceRemaining !== undefined && (
                                    <tr>
                                        <td className="py-1 text-slate-500 font-medium">Balance Remaining:</td>
                                        <td className="py-1 text-right font-bold text-slate-600">
                                            ₹ {Number(balanceRemaining).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                )}
                            </tfoot>
                        </table>
                    </div>

                    {/* Payment Mode & Reference */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <div>
                            <span className="text-slate-500 font-semibold">Payment Mode: </span>
                            <span className="font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                                {paymentMethod}
                            </span>
                            {transactionReference && (
                                <span className="text-slate-500 ml-2 font-mono">Ref: {transactionReference}</span>
                            )}
                        </div>
                        <div className="text-right">
                            <span className="text-slate-500 font-semibold">Cashier / Staff: </span>
                            <span className="font-bold text-slate-800">{collectedByName}</span>
                        </div>
                    </div>

                    {/* Stamp / Authorization */}
                    <div className="pt-8 flex items-end justify-between border-t border-slate-100 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                            <ShieldCheck size={16} />
                            <span>System Verified • Computer Generated</span>
                        </div>
                        <div className="text-center">
                            <div className="w-32 border-b border-dashed border-slate-400 mb-1"></div>
                            <span className="font-semibold text-slate-600">Authorized Signature</span>
                        </div>
                    </div>
                </div>

                {/* Footer close */}
                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100 print:hidden">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
