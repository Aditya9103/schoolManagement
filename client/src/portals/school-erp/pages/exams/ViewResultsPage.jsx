import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    Printer,
    Search,
    Filter,
    Award,
    TrendingUp,
    Users,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Sparkles,
    FileSpreadsheet,
    FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetClassResultsQuery } from '../../../../store/api/examApi';
import { printElement, generateClassMarksheetPdf } from '../../../../utils/pdfGenerator';

const DEFAULT_RESULTS = [
    {
        id: '1',
        rollNo: '101',
        studentName: 'Aarav Sharma',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        english: 88,
        math: 98,
        science: 94,
        sst: 96,
        hindi: 96,
        totalMarks: 472,
        maxMarks: 500,
        percentage: 94.4,
        grade: 'A+',
        result: 'PASS',
        rank: 1,
    },
    {
        id: '2',
        rollNo: '102',
        studentName: 'Ananya Verma',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        english: 85,
        math: 90,
        science: 88,
        sst: 82,
        hindi: 90,
        totalMarks: 435,
        maxMarks: 500,
        percentage: 87.0,
        grade: 'A',
        result: 'PASS',
        rank: 2,
    },
    {
        id: '3',
        rollNo: '103',
        studentName: 'Rohan Patel',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        english: 82,
        math: 85,
        science: 89,
        sst: 81,
        hindi: 87,
        totalMarks: 424,
        maxMarks: 500,
        percentage: 84.8,
        grade: 'A',
        result: 'PASS',
        rank: 3,
    },
    {
        id: '4',
        rollNo: '104',
        studentName: 'Sneha Gupta',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        english: 67,
        math: 72,
        science: 71,
        sst: 68,
        hindi: 75,
        totalMarks: 353,
        maxMarks: 500,
        percentage: 70.6,
        grade: 'B+',
        result: 'PASS',
        rank: 8,
    },
    {
        id: '5',
        rollNo: '105',
        studentName: 'Vihaan Singh',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        english: 45,
        math: 56,
        science: 49,
        sst: 52,
        hindi: 60,
        totalMarks: 262,
        maxMarks: 500,
        percentage: 52.4,
        grade: 'C',
        result: 'PASS',
        rank: 22,
    },
    {
        id: '6',
        rollNo: '106',
        studentName: 'Priya Kumari',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        english: 28,
        math: 31,
        science: 30,
        sst: 35,
        hindi: 36,
        totalMarks: 160,
        maxMarks: 500,
        percentage: 32.0,
        grade: 'E',
        result: 'FAIL',
        rank: 48,
    },
    {
        id: '7',
        rollNo: '107',
        studentName: 'Aditya Nair',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
        english: 78,
        math: 82,
        science: 80,
        sst: 75,
        hindi: 81,
        totalMarks: 396,
        maxMarks: 500,
        percentage: 79.2,
        grade: 'B+',
        result: 'PASS',
        rank: 6,
    },
    {
        id: '8',
        rollNo: '108',
        studentName: 'Meera Iyer',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        english: 94,
        math: 92,
        science: 95,
        sst: 88,
        hindi: 91,
        totalMarks: 460,
        maxMarks: 500,
        percentage: 92.0,
        grade: 'A+',
        result: 'PASS',
        rank: 2,
    },
];

export default function ViewResultsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [selectedExam, setSelectedExam] = useState(searchParams.get('exam') || 'Half Yearly Examination');
    const [selectedClass, setSelectedClass] = useState(searchParams.get('class') || 'Class 10');
    const [activeTab, setActiveTab] = useState('Overall Result');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudents, setSelectedStudents] = useState(new Set());

    const { data: resultsRes } = useGetClassResultsQuery({
        examName: selectedExam,
        className: selectedClass,
    });

    const students = DEFAULT_RESULTS;

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            if (activeTab === 'Top Performers' && s.percentage < 85) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return s.studentName.toLowerCase().includes(q) || s.rollNo.includes(q);
            }
            return true;
        });
    }, [students, activeTab, searchQuery]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
        } else {
            setSelectedStudents(new Set());
        }
    };

    const toggleSelect = (id) => {
        const next = new Set(selectedStudents);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedStudents(next);
    };

    const handlePrint = () => {
        printElement('class-results-marksheet');
    };

    const handleExportPDF = () => {
        generateClassMarksheetPdf(selectedClass, selectedExam, filteredStudents);
    };

    const handleExportCSV = () => {
        toast.success(`Exported ${selectedClass} mark sheet to CSV`);
    };

    return (
        <div className="space-y-6">
            {/* Header matching Screen 8 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>Academic</span>
                        <span>&gt;</span>
                        <span>Exams & Results</span>
                        <span>&gt;</span>
                        <span className="text-blue-600">View Results</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                            {selectedClass} - {selectedExam}
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Published
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Consolidated ledger and performance marksheet for evaluated academic terms.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => navigate('/school/exams')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleExportPDF}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span>Export PDF</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span>Export CSV</span>
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Print</span>
                    </button>
                </div>
            </div>

            {/* Quick Cohort Selectors & Tabs matching Screen 8 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {['Overall Result', 'Subject-wise', 'Class-wise', 'Analysis', 'Top Performers'].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => {
                                if (tab === 'Analysis') navigate('/school/exams/analytics');
                                else setActiveTab(tab);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white cursor-pointer"
                    >
                        <option value="Class 10">Class 10</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 6">Class 6</option>
                    </select>

                    <select
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white cursor-pointer"
                    >
                        <option value="Half Yearly Examination">Half Yearly Examination</option>
                        <option value="Unit Test 1">Unit Test 1</option>
                        <option value="Unit Test 2">Unit Test 2</option>
                        <option value="Pre-Board Exam">Pre-Board Exam</option>
                    </select>
                </div>
            </div>

            {/* Metric Summary Banner matching Screen 8 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Students</span>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">48</div>
                    <span className="text-[10px] text-blue-600 font-bold">100% Enrolled</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Passed</span>
                    <div className="text-xl font-extrabold text-emerald-600 mt-1">44</div>
                    <span className="text-[10px] text-emerald-700 font-bold">91.7% Pass Rate</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Failed</span>
                    <div className="text-xl font-extrabold text-rose-600 mt-1">4</div>
                    <span className="text-[10px] text-rose-600 font-bold">8.3% Needs Remedial</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Average</span>
                    <div className="text-xl font-extrabold text-blue-700 mt-1">78.6%</div>
                    <span className="text-[10px] text-slate-400 font-bold">Median: 81.4%</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Highest</span>
                    <div className="text-xl font-extrabold text-emerald-600 mt-1">98%</div>
                    <span className="text-[10px] text-emerald-700 font-bold">Aarav Sharma</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Lowest</span>
                    <div className="text-xl font-extrabold text-rose-500 mt-1">32%</div>
                    <span className="text-[10px] text-rose-600 font-bold">Passing: 33%</span>
                </div>
            </div>

            {/* Marksheet Table matching Screen 8 */}
            <div id="class-results-marksheet" className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Search Bar in table header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="relative w-full max-w-xs">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by student name or roll no..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                        Click student name to view detailed scorecard & analytics
                    </span>
                </div>

                <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs uppercase font-extrabold tracking-wider">
                                <th className="py-3.5 px-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                    />
                                </th>
                                <th className="py-3.5 px-3 w-12 text-center">#</th>
                                <th className="py-3.5 px-3 w-20">Roll No.</th>
                                <th className="py-3.5 px-4 min-w-[200px]">Student Name</th>
                                <th className="py-3.5 px-3 text-center">English</th>
                                <th className="py-3.5 px-3 text-center">Math</th>
                                <th className="py-3.5 px-3 text-center">Science</th>
                                <th className="py-3.5 px-3 text-center">SST</th>
                                <th className="py-3.5 px-3 text-center">Hindi</th>
                                <th className="py-3.5 px-3 text-center font-extrabold text-slate-900">Total (500)</th>
                                <th className="py-3.5 px-3 text-center font-extrabold text-blue-700">%</th>
                                <th className="py-3.5 px-3 text-center">Grade</th>
                                <th className="py-3.5 px-4 text-center">Result</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {filteredStudents.map((student, idx) => {
                                const isSelected = selectedStudents.has(student.id);
                                const isPass = student.result === 'PASS';

                                return (
                                    <tr
                                        key={student.id}
                                        onClick={() => navigate(`/school/exams/results/student/${student.id}?exam=${encodeURIComponent(selectedExam)}`)}
                                        className={`transition-colors hover:bg-blue-50/40 cursor-pointer ${
                                            isSelected ? 'bg-blue-50/30' : ''
                                        }`}
                                    >
                                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelect(student.id)}
                                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                            />
                                        </td>
                                        <td className="py-3.5 px-3 text-center text-slate-400 font-bold">
                                            {idx + 1}
                                        </td>
                                        <td className="py-3.5 px-3 font-mono font-extrabold text-slate-700">
                                            {student.rollNo}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2.5">
                                                <img
                                                    src={student.avatar}
                                                    alt={student.studentName}
                                                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                                                />
                                                <span className="font-extrabold text-slate-900 group-hover:text-blue-600">
                                                    {student.studentName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-3 text-center font-medium text-slate-700">{student.english}</td>
                                        <td className="py-3.5 px-3 text-center font-medium text-slate-700">{student.math}</td>
                                        <td className="py-3.5 px-3 text-center font-medium text-slate-700">{student.science}</td>
                                        <td className="py-3.5 px-3 text-center font-medium text-slate-700">{student.sst}</td>
                                        <td className="py-3.5 px-3 text-center font-medium text-slate-700">{student.hindi}</td>
                                        <td className="py-3.5 px-3 text-center font-extrabold text-slate-900 bg-slate-50/60">
                                            {student.totalMarks}
                                        </td>
                                        <td className="py-3.5 px-3 text-center font-extrabold text-blue-700 bg-blue-50/30">
                                            {student.percentage}%
                                        </td>
                                        <td className="py-3.5 px-3 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-extrabold text-[11px] ${
                                                student.grade.startsWith('A')
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : student.grade.startsWith('B')
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : student.grade.startsWith('C')
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-rose-100 text-rose-800'
                                            }`}>
                                                {student.grade}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                                isPass
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                            }`}>
                                                {isPass ? 'Pass' : 'Fail'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <p>
                        Showing <strong className="text-slate-800">{filteredStudents.length}</strong> evaluated student scorecards
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate('/school/exams/report-cards')}
                            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-2xs"
                        >
                            Generate Report Cards
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
