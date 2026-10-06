import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Printer,
    Download,
    Award,
    Sparkles,
    CheckCircle2,
    Eye,
    FileText,
    Calendar,
    Search,
    Share2,
    ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { printElement, downloadElementAsPdf, generateStudentReportCardPdf } from '../../../../utils/pdfGenerator';

const STUDENTS_REPORT_LIST = [
    {
        id: '1',
        rollNo: '101',
        name: 'Aarav Sharma',
        class: '10 - A',
        status: 'Generated',
        totalMarks: 472,
        maxMarks: 500,
        percentage: 94.4,
        grade: 'A+',
        rank: 1,
        remarks: 'Outstanding performance across theoretical and applied concepts. Keep it up!',
        subjects: [
            { subject: 'English', marks: 88, maxMarks: 100, percentage: 88, grade: 'A' },
            { subject: 'Mathematics', marks: 98, maxMarks: 100, percentage: 98, grade: 'A+' },
            { subject: 'Science', marks: 94, maxMarks: 100, percentage: 94, grade: 'A+' },
            { subject: 'Social Science', marks: 96, maxMarks: 100, percentage: 96, grade: 'A+' },
            { subject: 'Hindi', marks: 96, maxMarks: 100, percentage: 96, grade: 'A+' },
        ],
    },
    {
        id: '2',
        rollNo: '102',
        name: 'Ananya Verma',
        class: '10 - A',
        status: 'Generated',
        totalMarks: 435,
        maxMarks: 500,
        percentage: 87.0,
        grade: 'A',
        rank: 2,
        remarks: 'Diligent student with great analytical abilities. Excellent consistency.',
        subjects: [
            { subject: 'English', marks: 85, maxMarks: 100, percentage: 85, grade: 'A' },
            { subject: 'Mathematics', marks: 90, maxMarks: 100, percentage: 90, grade: 'A' },
            { subject: 'Science', marks: 88, maxMarks: 100, percentage: 88, grade: 'A' },
            { subject: 'Social Science', marks: 82, maxMarks: 100, percentage: 82, grade: 'A' },
            { subject: 'Hindi', marks: 90, maxMarks: 100, percentage: 90, grade: 'A' },
        ],
    },
    {
        id: '3',
        rollNo: '103',
        name: 'Rohan Patel',
        class: '10 - A',
        status: 'Generated',
        totalMarks: 424,
        maxMarks: 500,
        percentage: 84.8,
        grade: 'A',
        rank: 3,
        remarks: 'Good grasp of core concepts. Shows high promise in natural sciences.',
        subjects: [
            { subject: 'English', marks: 82, maxMarks: 100, percentage: 82, grade: 'A' },
            { subject: 'Mathematics', marks: 85, maxMarks: 100, percentage: 85, grade: 'A' },
            { subject: 'Science', marks: 89, maxMarks: 100, percentage: 89, grade: 'A' },
            { subject: 'Social Science', marks: 81, maxMarks: 100, percentage: 81, grade: 'A' },
            { subject: 'Hindi', marks: 87, maxMarks: 100, percentage: 87, grade: 'A' },
        ],
    },
    {
        id: '4',
        rollNo: '104',
        name: 'Sneha Gupta',
        class: '10 - A',
        status: 'Generated',
        totalMarks: 353,
        maxMarks: 500,
        percentage: 70.6,
        grade: 'B+',
        rank: 8,
        remarks: 'Consistent worker, shows strong creative ability. Focus on mathematics.',
        subjects: [
            { subject: 'English', marks: 67, maxMarks: 100, percentage: 67, grade: 'B' },
            { subject: 'Mathematics', marks: 74, maxMarks: 100, percentage: 74, grade: 'B+' },
            { subject: 'Science', marks: 70, maxMarks: 100, percentage: 70, grade: 'B+' },
            { subject: 'Social Science', marks: 68, maxMarks: 100, percentage: 68, grade: 'B' },
            { subject: 'Hindi', marks: 74, maxMarks: 100, percentage: 74, grade: 'B+' },
        ],
    },
    {
        id: '5',
        rollNo: '105',
        name: 'Vihaan Singh',
        class: '10 - A',
        status: 'Generated',
        totalMarks: 262,
        maxMarks: 500,
        percentage: 52.4,
        grade: 'C',
        rank: 22,
        remarks: 'Capable of higher marks with structured revision and regular attendance.',
        subjects: [
            { subject: 'English', marks: 50, maxMarks: 100, percentage: 50, grade: 'C' },
            { subject: 'Mathematics', marks: 54, maxMarks: 100, percentage: 54, grade: 'C' },
            { subject: 'Science', marks: 52, maxMarks: 100, percentage: 52, grade: 'C' },
            { subject: 'Social Science', marks: 51, maxMarks: 100, percentage: 51, grade: 'C' },
            { subject: 'Hindi', marks: 55, maxMarks: 100, percentage: 55, grade: 'C' },
        ],
    },
];

export default function ReportCardsPage() {
    const navigate = useNavigate();

    const [selectedClass, setSelectedClass] = useState('Class 10');
    const [selectedExam, setSelectedExam] = useState('Half Yearly Examination');
    const [selectedStudent, setSelectedStudent] = useState(STUDENTS_REPORT_LIST[0]);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStudents = STUDENTS_REPORT_LIST.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.includes(searchQuery)
    );

    const handlePrint = () => {
        printElement('report-card-certificate');
    };

    const handleDownloadPDF = (student = selectedStudent) => {
        generateStudentReportCardPdf(student, selectedExam, '2026 - 27');
    };

    const handleDownloadAll = () => {
        toast.success(`Generating report cards for all ${filteredStudents.length} students...`);
        filteredStudents.forEach((st, idx) => {
            setTimeout(() => {
                generateStudentReportCardPdf(st, selectedExam, '2026 - 27');
            }, idx * 300);
        });
    };

    return (
        <div className="space-y-6">
            {/* Header matching Screen 10 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>Academic</span>
                        <span>&gt;</span>
                        <span>Exams & Results</span>
                        <span>&gt;</span>
                        <span className="text-blue-600">Report Cards</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                            Report Cards
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                            <Sparkles className="w-3.5 h-3.5" /> CBSE Format
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Generate and download official school report cards with verified institutional crest and signatures.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
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
                        onClick={() => toast.success(`Generated all report cards for ${selectedClass}!`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                        <span>Generate</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleDownloadAll}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download All</span>
                    </button>
                </div>
            </div>

            {/* Selector Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div>
                        <span className="text-xs font-bold text-slate-500 mr-2">Class:</span>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
                        >
                            <option value="Class 10">Class 10</option>
                            <option value="Class 9">Class 9</option>
                            <option value="Class 8">Class 8</option>
                            <option value="Class 7">Class 7</option>
                            <option value="Class 6">Class 6</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-xs font-bold text-slate-500 mr-2">Exam:</span>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
                        >
                            <option value="Half Yearly Examination">Half Yearly Examination</option>
                            <option value="Unit Test 1">Unit Test 1</option>
                            <option value="Unit Test 2">Unit Test 2</option>
                            <option value="Annual Examination">Annual Examination</option>
                        </select>
                    </div>
                </div>

                <div className="relative w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search student..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none"
                    />
                </div>
            </div>

            {/* Split Screen Grid matching Screen 10 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Students Cohort List (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                            Student Cohort ({filteredStudents.length})
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-400">Select to preview card</span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
                        {filteredStudents.map((st, idx) => {
                            const isCurrent = selectedStudent.id === st.id;
                            return (
                                <div
                                    key={st.id}
                                    onClick={() => setSelectedStudent(st)}
                                    className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                                        isCurrent ? 'bg-blue-50/60 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-bold text-slate-400 w-6">
                                            #{st.rollNo}
                                        </span>
                                        <div>
                                            <p className={`text-xs font-extrabold ${isCurrent ? 'text-blue-900' : 'text-slate-900'}`}>
                                                {st.name}
                                            </p>
                                            <span className="text-[10px] text-slate-500 font-medium">
                                                {st.percentage}% • Grade {st.grade} • Rank #{st.rank}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            Generated
                                        </span>
                                        <button
                                            type="button"
                                            title="Download Single PDF"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                generateStudentReportCardPdf(st, selectedExam, '2026 - 27');
                                            }}
                                            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: The Official Greenwood International School Report Card Preview matching Screen 10 (7 cols) */}
                <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-md space-y-6 print:border-none print:shadow-none print:p-0">
                    {/* Top Action Bar above the card */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-600" /> Official Verification Preview
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDownloadPDF(selectedStudent)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download PDF</span>
                            </button>
                        </div>
                    </div>

                    {/* Report Card Document Frame (Matching Screen 10 Crest & Layout) */}
                    <div id="report-card-certificate" className="border-4 border-double border-slate-800 p-6 sm:p-8 rounded-2xl bg-white space-y-6">
                        {/* School Crest & Header */}
                        <div className="text-center space-y-1 pb-4 border-b-2 border-slate-800">
                            {/* School Crest Shield */}
                            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-600 text-white flex items-center justify-center shadow-md mb-2">
                                <Award className="w-8 h-8 text-white stroke-[2.5]" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif uppercase">
                                Greenwood International School
                            </h2>
                            <p className="text-[11px] font-semibold text-slate-600 tracking-wider">
                                Affiliated to CBSE, New Delhi • Affiliation No. 2130001 • School Code: 54321
                            </p>
                            <div className="pt-2">
                                <span className="inline-block px-4 py-1 rounded-full bg-slate-100 font-extrabold text-xs text-slate-900 tracking-wide uppercase border border-slate-300">
                                    {selectedExam} Report Card
                                </span>
                                <p className="text-[10px] text-slate-500 font-bold mt-1">Academic Year: 2026 - 27</p>
                            </div>
                        </div>

                        {/* Student Meta Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <div>
                                <span className="text-slate-400 block text-[10px] font-bold uppercase">Student Name:</span>
                                <strong className="text-slate-900 text-xs">{selectedStudent.name}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] font-bold uppercase">Roll No:</span>
                                <strong className="text-slate-900 text-xs font-mono">{selectedStudent.rollNo}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] font-bold uppercase">Class & Sec:</span>
                                <strong className="text-slate-900 text-xs">{selectedStudent.class}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] font-bold uppercase">Date of Issue:</span>
                                <strong className="text-slate-900 text-xs">30 Jun 2026</strong>
                            </div>
                        </div>

                        {/* Academic Marks Table */}
                        <div className="overflow-x-auto print:overflow-visible">
                            <table className="w-full text-left border-collapse text-xs border border-slate-300">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-extrabold uppercase">
                                        <th className="py-2.5 px-3 border-r border-slate-300">Subject</th>
                                        <th className="py-2.5 px-3 border-r border-slate-300 text-center">Marks Obtained</th>
                                        <th className="py-2.5 px-3 border-r border-slate-300 text-center">Max Marks</th>
                                        <th className="py-2.5 px-3 border-r border-slate-300 text-center">Percentage</th>
                                        <th className="py-2.5 px-3 text-center">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 font-medium">
                                    {(selectedStudent.subjects || []).map((sub) => (
                                        <tr key={sub.subject}>
                                            <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-slate-800">{sub.subject}</td>
                                            <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">{sub.marks}</td>
                                            <td className="py-2.5 px-3 border-r border-slate-200 text-center text-slate-500">{sub.maxMarks || 100}</td>
                                            <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold text-blue-700">{sub.percentage || Math.round((sub.marks / (sub.maxMarks || 100)) * 100)}%</td>
                                            <td className="py-2.5 px-3 text-center font-extrabold text-emerald-700">{sub.grade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-slate-50 border-t-2 border-slate-300 font-extrabold text-slate-900">
                                        <td className="py-2.5 px-3 border-r border-slate-300 uppercase">Grand Total</td>
                                        <td className="py-2.5 px-3 border-r border-slate-300 text-center text-blue-700">{selectedStudent.totalMarks}</td>
                                        <td className="py-2.5 px-3 border-r border-slate-300 text-center">{selectedStudent.maxMarks}</td>
                                        <td className="py-2.5 px-3 border-r border-slate-300 text-center text-blue-800">{selectedStudent.percentage}%</td>
                                        <td className="py-2.5 px-3 text-center text-emerald-700">{selectedStudent.grade}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Result & Remarks Card matching Screen 10 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-3.5 rounded-xl border border-slate-200 space-y-1 bg-slate-50/50">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Result Status:</span>
                                    <strong className="text-emerald-700 font-extrabold">PASS</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Percentage:</span>
                                    <strong className="text-blue-800 font-extrabold">{selectedStudent.percentage}%</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Overall Grade:</span>
                                    <strong className="text-emerald-700 font-extrabold">{selectedStudent.grade}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Class Rank:</span>
                                    <strong className="text-purple-700 font-extrabold">#{selectedStudent.rank} / 48</strong>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl border border-slate-200 space-y-1 bg-slate-50/50 flex flex-col justify-between">
                                <div>
                                    <span className="text-slate-500 font-bold block mb-1">Teacher's Remarks:</span>
                                    <p className="text-[11px] text-slate-700 italic">
                                        "{selectedStudent.remarks}"
                                    </p>
                                </div>
                                <div className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200">
                                    Promoted to Next Term
                                </div>
                            </div>
                        </div>

                        {/* Signatures matching Screen 10 */}
                        <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-600 font-bold">
                            <div className="border-t border-slate-400 pt-2">
                                <p className="font-serif italic text-slate-800 text-sm mb-1">Sunita Paul</p>
                                <span>Class Teacher</span>
                            </div>
                            <div className="border-t border-slate-400 pt-2">
                                <p className="font-serif italic text-slate-800 text-sm mb-1">Dr. S. K. Bose</p>
                                <span>Principal & Institutional Head</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
