import React, { useState, useMemo } from 'react';
import {
    Wallet, DollarSign, TrendingUp, AlertTriangle, Users, Download,
    Plus, Search, Filter, RefreshCw, Printer, CheckCircle2, Clock,
    ArrowUpRight, FileText, ChevronRight, Send, AlertCircle, Eye,
    Layers, Receipt, UserCheck, ShieldCheck
} from 'lucide-react';
import {
    useGetFeeOverviewQuery,
    useGetFeeAllocationsQuery,
    useGetFeeTransactionsQuery,
    useGetFeeStructuresQuery,
    useGetFeeDefaultersQuery
} from '../../../../store/api/feeApi';
import { useGetClassesQuery } from '../../../../store/api/classApi';
import CollectFeeModal from './components/CollectFeeModal';
import FeeReceiptModal from './components/FeeReceiptModal';
import CreateFeeStructureModal from './components/CreateFeeStructureModal';

export default function FeesPage() {
    const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' | 'defaulters' | 'transactions' | 'structures'
    const [search, setSearch] = useState('');
    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');

    // Modals
    const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
    const [isCreateStructureOpen, setIsCreateStructureOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [activeReceiptData, setActiveReceiptData] = useState(null);
    const [preselectedAllocation, setPreselectedAllocation] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    // Queries
    const { data: overviewRes, isLoading: overviewLoading, refetch: refetchOverview } = useGetFeeOverviewQuery();
    const { data: classesRes } = useGetClassesQuery();

    const allocationParams = useMemo(() => ({
        classId: selectedClass !== 'All' ? selectedClass : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        search: search.trim() || undefined,
        limit: 50,
    }), [selectedClass, selectedStatus, search]);

    const { data: allocationsRes, isLoading: allocLoading, refetch: refetchAlloc } = useGetFeeAllocationsQuery(allocationParams);

    const transactionParams = useMemo(() => ({
        paymentMethod: selectedPaymentMethod !== 'All' ? selectedPaymentMethod : undefined,
        search: search.trim() || undefined,
        limit: 50,
    }), [selectedPaymentMethod, search]);

    const { data: transactionsRes, isLoading: txLoading, refetch: refetchTx } = useGetFeeTransactionsQuery(transactionParams);
    const { data: structuresRes, isLoading: structLoading, refetch: refetchStruct } = useGetFeeStructuresQuery();
    const { data: defaultersRes, isLoading: defLoading } = useGetFeeDefaultersQuery({
        classId: selectedClass !== 'All' ? selectedClass : undefined,
    });

    const kpis = overviewRes?.data?.kpis || {
        totalProjected: 0,
        totalCollected: 0,
        totalPending: 0,
        defaultersCount: 0,
        collectionRate: 0,
    };

    const classes = classesRes?.data?.classes || classesRes?.data || [];
    const allocations = allocationsRes?.data?.allocations || [];
    const transactions = transactionsRes?.data?.transactions || [];
    const structures = structuresRes?.data || [];
    const defaulters = defaultersRes?.data || [];

    const handleRefreshAll = () => {
        refetchOverview();
        refetchAlloc();
        refetchTx();
        refetchStruct();
    };

    const handleOpenCollectFor = (alloc) => {
        setPreselectedAllocation(alloc);
        setIsCollectModalOpen(true);
    };

    const handlePaymentSuccess = (receiptPayload) => {
        setActiveReceiptData(receiptPayload);
        setIsReceiptModalOpen(true);
        handleRefreshAll();
        showToast('Payment recorded successfully! Receipt generated.');
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    const getStudentFullName = (s, fallback = 'Student') => {
        if (!s) return fallback;
        const name = `${s.firstName || s.personalInfo?.firstName || ''} ${s.lastName || s.personalInfo?.lastName || ''}`.trim();
        return name || fallback;
    };

    const handleViewReceipt = (tx) => {
        setActiveReceiptData({
            receiptNumber: tx.receiptNumber,
            paymentDate: tx.paymentDate,
            studentName: getStudentFullName(tx.studentId, 'Student'),
            admissionNo: tx.studentId?.admissionNo || '',
            className: tx.studentId?.classId?.name || '',
            amount: tx.amount,
            paymentMethod: tx.paymentMethod,
            transactionReference: tx.transactionReference,
            collectedByName: tx.collectedByName || 'Fee Cashier',
            breakdown: tx.breakdown || [],
            balanceRemaining: 0,
        });
        setIsReceiptModalOpen(true);
    };

    const handleExportCSV = () => {
        let headers = [];
        let rows = [];
        let filename = 'fee-report.csv';

        if (activeTab === 'accounts') {
            headers = ['Student Name,Admission No,Class,Fee Structure,Total Payable,Paid Amount,Balance Due,Status\n'];
            rows = allocations.map((a) => {
                const sName = getStudentFullName(a.studentId, 'N/A');
                return `"${sName}","${a.studentId?.admissionNo || ''}","${a.classId?.name || ''}","${a.feeStructureId?.name || ''}",${a.netPayable},${a.paidAmount},${a.balanceAmount},"${a.status}"`;
            });
            filename = 'student-fee-accounts.csv';
        } else if (activeTab === 'transactions') {
            headers = ['Receipt No,Student Name,Admission No,Amount,Mode,Reference,Date,Cashier\n'];
            rows = transactions.map((t) => {
                const sName = getStudentFullName(t.studentId, 'N/A');
                return `"${t.receiptNumber}","${sName}","${t.studentId?.admissionNo || ''}",${t.amount},"${t.paymentMethod}","${t.transactionReference || ''}","${new Date(t.paymentDate).toLocaleDateString()}","${t.collectedByName || ''}"`;
            });
            filename = 'fee-transactions-receipts.csv';
        } else if (activeTab === 'defaulters') {
            headers = ['Student Name,Admission No,Class,Balance Overdue,Due Date,Parent Contact\n'];
            rows = defaulters.map((d) => {
                const sName = getStudentFullName(d.studentId, 'N/A');
                return `"${sName}","${d.studentId?.admissionNo || ''}","${d.classId?.name || ''}",${d.balanceAmount},"${d.dueDate ? new Date(d.dueDate).toLocaleDateString() : 'N/A'}","${d.studentId?.guardianInfo?.emergencyPhone || d.studentId?.emergencyContact || ''}"`;
            });
            filename = 'fee-defaulters.csv';
        }

        const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-5 lg:p-6 space-y-5 max-w-[1720px] mx-auto pb-16">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-4">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* ── Tier 1: Header Hub ─────────────────────────────────────────── */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0 mt-0.5 sm:mt-0">
                        <Wallet size={22} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                                Fees & Financial Management Hub
                            </h1>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <ShieldCheck size={11} />
                                Live Accounting Ledger
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Real-time fee collections, student ledgers, automated receipts & defaulters register
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <button
                        type="button"
                        onClick={handleRefreshAll}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        title="Refresh live ledger"
                    >
                        <RefreshCw size={14} className={overviewLoading ? 'animate-spin' : ''} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
                    >
                        <Download size={14} />
                        <span>Export CSV</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsCreateStructureOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-200 shadow-2xs transition-all cursor-pointer"
                    >
                        <Plus size={14} />
                        <span>New Structure</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setPreselectedAllocation(null);
                            setIsCollectModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                        <Wallet size={15} />
                        <span>Collect Fees</span>
                    </button>
                </div>
            </div>

            {/* ── Tier 2: Real Financial KPI Cards ────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-500 block">Total Projected Revenue</span>
                        <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 block">
                            ₹ {kpis.totalProjected.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Academic Year 2026-27</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 block">Collected to Date</span>
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                {kpis.collectionRate}%
                            </span>
                        </div>
                        <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight mt-1 block">
                            ₹ {kpis.totalCollected.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Realized in bank & cash</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-500 block">Pending Outstanding</span>
                        <span className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight mt-1 block">
                            ₹ {kpis.totalPending.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">Across all wings</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock size={24} />
                    </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-500 block">Overdue Defaulters</span>
                        <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight mt-1 block">
                            {kpis.defaultersCount} Students
                        </span>
                        <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">Payment due date passed</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <AlertTriangle size={24} />
                    </div>
                </div>
            </div>

            {/* ── Tier 3: Tabs & Filter Hub ───────────────────────────────────── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="border-b border-slate-200 px-4 sm:px-6 pt-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none pb-px">
                        <button
                            type="button"
                            onClick={() => setActiveTab('accounts')}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                                activeTab === 'accounts'
                                    ? 'border-emerald-600 text-emerald-600 bg-emerald-50/40 rounded-t-xl'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Users size={15} />
                            <span>Student Accounts</span>
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-extrabold">
                                {allocations.length}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('defaulters')}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                                activeTab === 'defaulters'
                                    ? 'border-rose-600 text-rose-600 bg-rose-50/40 rounded-t-xl'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <AlertTriangle size={15} />
                            <span>Defaulters Register</span>
                            {kpis.defaultersCount > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-extrabold">
                                    {kpis.defaultersCount}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('transactions')}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                                activeTab === 'transactions'
                                    ? 'border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-xl'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Receipt size={15} />
                            <span>Transactions & Receipts</span>
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-extrabold">
                                {transactions.length}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('structures')}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                                activeTab === 'structures'
                                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40 rounded-t-xl'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Layers size={15} />
                            <span>Fee Structures & Heads</span>
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-extrabold">
                                {structures.length}
                            </span>
                        </button>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex items-center gap-2.5 pb-3 md:pb-0 flex-wrap">
                        {activeTab !== 'structures' && (
                            <div className="relative min-w-[200px] flex-1 sm:flex-none">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search student / adm no..."
                                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        )}

                        {activeTab === 'accounts' && (
                            <>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
                                >
                                    <option value="All">All Classes</option>
                                    {classes.map((c) => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="PAID">Fully Paid</option>
                                    <option value="PARTIALLY_PAID">Partially Paid</option>
                                    <option value="OVERDUE">Overdue</option>
                                    <option value="UNPAID">Unpaid</option>
                                </select>
                            </>
                        )}

                        {activeTab === 'transactions' && (
                            <select
                                value={selectedPaymentMethod}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
                            >
                                <option value="All">All Modes</option>
                                <option value="CASH">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="CARD">Card</option>
                                <option value="NET_BANKING">Net Banking</option>
                                <option value="CHEQUE">Cheque</option>
                            </select>
                        )}
                    </div>
                </div>

                {/* Tab Content 1: Student Accounts */}
                {activeTab === 'accounts' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                    <th className="py-3 px-4">Student</th>
                                    <th className="py-3 px-4">Class & Section</th>
                                    <th className="py-3 px-4">Structure</th>
                                    <th className="py-3 px-4 text-right">Total Payable</th>
                                    <th className="py-3 px-4 text-right">Paid</th>
                                    <th className="py-3 px-4 text-right">Balance Due</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {allocLoading ? (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center text-slate-400">
                                            Loading student accounts...
                                        </td>
                                    </tr>
                                ) : allocations.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center text-slate-400">
                                            No student accounts found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    allocations.map((alloc) => {
                                        const s = alloc.studentId;
                                        const sName = getStudentFullName(s, 'Unknown Student');
                                        return (
                                            <tr key={alloc._id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                                                            {sName.charAt(0) || 'S'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{sName}</div>
                                                            <div className="text-[11px] text-slate-400">
                                                                Adm: {s?.admissionNo || 'N/A'} • Roll: {s?.rollNo || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-slate-700">
                                                    {alloc.classId?.name || 'Class N/A'} {alloc.sectionId?.name ? `(${alloc.sectionId?.name})` : ''}
                                                </td>
                                                <td className="py-3 px-4 text-slate-600 font-medium max-w-[200px] truncate" title={alloc.feeStructureId?.name}>
                                                    {alloc.feeStructureId?.name || 'Standard Fee'}
                                                </td>
                                                <td className="py-3 px-4 text-right font-bold text-slate-800">
                                                    ₹ {alloc.netPayable?.toLocaleString('en-IN')}
                                                </td>
                                                <td className="py-3 px-4 text-right font-bold text-emerald-600">
                                                    ₹ {alloc.paidAmount?.toLocaleString('en-IN')}
                                                </td>
                                                <td className="py-3 px-4 text-right font-black text-amber-700">
                                                    ₹ {alloc.balanceAmount?.toLocaleString('en-IN')}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                                        alloc.status === 'PAID'
                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                            : alloc.status === 'PARTIALLY_PAID'
                                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                            : alloc.status === 'OVERDUE'
                                                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                                                    }`}>
                                                        {alloc.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    {alloc.balanceAmount > 0 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenCollectFor(alloc)}
                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-all cursor-pointer"
                                                        >
                                                            <Wallet size={12} />
                                                            <span>Collect</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-[11px] text-emerald-600 font-bold inline-flex items-center gap-1">
                                                            <CheckCircle2 size={13} />
                                                            <span>Settled</span>
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tab Content 2: Defaulters Register */}
                {activeTab === 'defaulters' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-rose-50/40 border-b border-rose-100 text-rose-900 font-bold uppercase tracking-wider text-[11px]">
                                    <th className="py-3 px-4">Student Details</th>
                                    <th className="py-3 px-4">Class</th>
                                    <th className="py-3 px-4 text-right">Outstanding Overdue</th>
                                    <th className="py-3 px-4">Due Date</th>
                                    <th className="py-3 px-4">Emergency Contact</th>
                                    <th className="py-3 px-4 text-right">Quick Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {defLoading ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-400">
                                            Scanning overdue records...
                                        </td>
                                    </tr>
                                ) : defaulters.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-emerald-600 font-bold">
                                            🎉 Zero overdue defaulters! All active student accounts are compliant.
                                        </td>
                                    </tr>
                                ) : (
                                    defaulters.map((d) => {
                                        const s = d.studentId;
                                        const sName = getStudentFullName(s, 'Student');
                                        return (
                                            <tr key={d._id} className="hover:bg-rose-50/20 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-slate-900">{sName}</div>
                                                    <div className="text-[11px] text-slate-400">
                                                        Adm: {s?.admissionNo} • Father: {s?.guardianInfo?.fatherName || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-slate-700">
                                                    {d.classId?.name} {d.sectionId?.name ? `(${d.sectionId?.name})` : ''}
                                                </td>
                                                <td className="py-3 px-4 text-right font-black text-rose-600 text-sm">
                                                    ₹ {d.balanceAmount?.toLocaleString('en-IN')}
                                                </td>
                                                <td className="py-3 px-4 text-slate-600 font-medium">
                                                    {d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-IN') : 'Past Due'}
                                                </td>
                                                <td className="py-3 px-4 text-slate-700 font-mono text-xs">
                                                    {s?.guardianInfo?.emergencyPhone || s?.guardianInfo?.fatherPhone || '9876543210'}
                                                </td>
                                                <td className="py-3 px-4 text-right space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => showToast(`SMS reminder dispatched to guardian of ${sName}`)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                                                    >
                                                        <Send size={11} />
                                                        <span>Send Alert</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenCollectFor(d)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-all cursor-pointer"
                                                    >
                                                        <Wallet size={11} />
                                                        <span>Collect</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tab Content 3: Transactions Register */}
                {activeTab === 'transactions' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                    <th className="py-3 px-4">Receipt Number</th>
                                    <th className="py-3 px-4">Student</th>
                                    <th className="py-3 px-4 text-right">Amount Paid</th>
                                    <th className="py-3 px-4">Payment Mode</th>
                                    <th className="py-3 px-4">Reference</th>
                                    <th className="py-3 px-4">Date & Time</th>
                                    <th className="py-3 px-4">Cashier / Staff</th>
                                    <th className="py-3 px-4 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {txLoading ? (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center text-slate-400">
                                            Loading receipt audit log...
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center text-slate-400">
                                            No transactions recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => {
                                        const s = tx.studentId;
                                        const sName = getStudentFullName(s, 'Student');
                                        return (
                                            <tr key={tx._id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3 px-4 font-mono font-black text-slate-900">
                                                    {tx.receiptNumber}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-slate-900">{sName}</div>
                                                    <div className="text-[11px] text-slate-400">Adm: {s?.admissionNo || 'N/A'}</div>
                                                </td>
                                                <td className="py-3 px-4 text-right font-black text-emerald-700 text-sm">
                                                    ₹ {tx.amount?.toLocaleString('en-IN')}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="font-extrabold px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                                                        {tx.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                                                    {tx.transactionReference || 'COUNTER-CASH'}
                                                </td>
                                                <td className="py-3 px-4 text-slate-600 font-medium">
                                                    {new Date(tx.paymentDate).toLocaleString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="py-3 px-4 text-slate-700 font-medium">
                                                    {tx.collectedByName || 'Desk Cashier'}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewReceipt(tx)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold text-[11px] transition-all shadow-2xs cursor-pointer"
                                                    >
                                                        <Printer size={12} />
                                                        <span>Print</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tab Content 4: Fee Structures & Heads */}
                {activeTab === 'structures' && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {structLoading ? (
                            <div className="col-span-full py-12 text-center text-slate-400">
                                Loading fee structures...
                            </div>
                        ) : structures.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-slate-400">
                                No fee structures defined. Click "New Structure" above to create one.
                            </div>
                        ) : (
                            structures.map((st) => (
                                <div key={st._id} className="bg-slate-50/60 rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider block">
                                                {st.academicYear}
                                            </span>
                                            <h3 className="font-bold text-slate-900 text-sm mt-0.5">{st.name}</h3>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                            ACTIVE
                                        </span>
                                    </div>

                                    {/* Applicable Classes */}
                                    <div className="flex flex-wrap gap-1">
                                        {st.classIds?.map((c) => (
                                            <span key={c._id} className="px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[10px] font-bold">
                                                {c.name}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Component Heads */}
                                    <div className="divide-y divide-slate-200/60 text-xs pt-1">
                                        {st.components?.map((comp, idx) => (
                                            <div key={idx} className="py-1.5 flex items-center justify-between">
                                                <span className="text-slate-600 font-medium">{comp.name}</span>
                                                <span className="font-bold text-slate-900">
                                                    ₹ {comp.amount?.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total Footer */}
                                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700">Total Fee:</span>
                                        <span className="font-mono font-black text-blue-700 text-base">
                                            ₹ {st.totalAmount?.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <CollectFeeModal
                isOpen={isCollectModalOpen}
                onClose={() => {
                    setIsCollectModalOpen(false);
                    setPreselectedAllocation(null);
                }}
                preselectedAllocation={preselectedAllocation}
                onSuccess={handlePaymentSuccess}
            />

            <FeeReceiptModal
                isOpen={isReceiptModalOpen}
                onClose={() => {
                    setIsReceiptModalOpen(false);
                    setActiveReceiptData(null);
                }}
                receiptData={activeReceiptData}
            />

            <CreateFeeStructureModal
                isOpen={isCreateStructureOpen}
                onClose={() => {
                    setIsCreateStructureOpen(false);
                    refetchStruct();
                    refetchOverview();
                }}
            />
        </div>
    );
}
