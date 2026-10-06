import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    Printer,
    Download,
    Award,
    TrendingUp,
    Calendar,
    CheckCircle2,
    BookOpen,
    UserCheck,
    MessageSquare,
    FileText,
    Sparkles,
} from 'lucide-react';
import { printElement, generateStudentScorecardPdf, generateStudentReportCardPdf } from '../../../../utils/pdfGenerator';

const DEFAULT_STUDENT_PROFILE = {
    id: '1',
    name: 'Aarav Sharma',
    rollNo: '101',
    className: 'Class 10 - A',
    examName: 'Half Yearly Examination',
    academicYear: '2026 - 27',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    totalMarks: 472,
    maxMarks: 500,
    percentage: 94.4,
    grade: 'A+',
    rank: 1,
    totalStudents: 48,
    resultStatus: 'PASS',
    attendancePercentage: 96.5,
    attendanceDays: '185 / 192 Days',
    teacherRemarks: 'Exceptional intellectual curiosity and methodical study approach. Aarav has achieved the highest distinction in Mathematics and Natural Sciences.',
    subjects: [
        { subject: 'English', marks: 88, maxMarks: 100, percentage: 88, grade: 'A', status: 'Pass', remarks: 'Fluent and expressive essays' },
        { subject: 'Mathematics', marks: 98, maxMarks: 100, percentage: 98, grade: 'A+', status: 'Pass', remarks: 'Flawless geometry and calculus solutions' },
        { subject: 'Science', marks: 94, maxMarks: 100, percentage: 94, grade: 'A+', status: 'Pass', remarks: 'Superb practical laboratory work' },
        { subject: 'Social Science', marks: 96, maxMarks: 100, percentage: 96, grade: 'A+', status: 'Pass', remarks: 'Deep contextual understanding of history' },
        { subject: 'Hindi', marks: 96, maxMarks: 100, percentage: 96, grade: 'A+', status: 'Pass', remarks: 'Accurate grammar and poetry interpretation' },
    ],
};

export default function StudentResultDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const examParam = searchParams.get('exam') || 'Half Yearly Examination';

    const [activeTab, setActiveTab] = useState('Subject-wise Result');

    const student = DEFAULT_STUDENT_PROFILE;

    const handlePrint = () => {
        printElement('student-scorecard-section');
    };

    const handleDownloadPDF = () => {
        generateStudentScorecardPdf(student, examParam, '2026 - 27');
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb & Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <button
                        type="button"
                        onClick={() => navigate('/school/exams/results')}
                        className="hover:text-blue-600 cursor-pointer"
                    >
                        View Results
                    </button>
                    <span>&gt;</span>
                    <span className="text-blue-600 font-bold">Student Result Detail</span>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => navigate('/school/exams/results')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Marksheet</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleDownloadPDF}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download Scorecard</span>
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

            {/* Printable Scorecard Section */}
            <div id="student-scorecard-section" className="space-y-6">
                {/* Top Student Profile Card matching Screen 9 */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Student Basic Information */}
                    <div className="flex items-center gap-5">
                        <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-blue-50 shadow-sm"
                        />
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                                    {student.name}
                                </h1>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold mt-1">
                                Roll No: <span className="text-slate-800 font-bold">{student.rollNo}</span> • Class: <span className="text-slate-800 font-bold">{student.className}</span> • Exam: <span className="text-blue-600 font-bold">{examParam}</span>
                            </p>
                            <span className="inline-block mt-2 text-[11px] font-semibold text-slate-400">
                                Academic Year: 2026 - 27
                            </span>
                        </div>
                    </div>

                    {/* Stat Badges matching Screen 9 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Total Marks
                            </span>
                            <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                                {student.totalMarks} / {student.maxMarks}
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-center">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                                Percentage
                            </span>
                            <div className="text-base sm:text-lg font-extrabold text-blue-800 mt-1">
                                {student.percentage}%
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-center">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                                Grade
                            </span>
                            <div className="text-base sm:text-lg font-extrabold text-emerald-800 mt-1">
                                {student.grade}
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/70 text-center">
                            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
                                Class Rank
                            </span>
                            <div className="text-base sm:text-lg font-extrabold text-purple-800 mt-1">
                                #{student.rank} / {student.totalStudents}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Tabs matching Screen 9 */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-5 mt-6 overflow-x-auto">
                    {['Subject-wise Result', 'Performance Analysis', 'Attendance', 'Remarks', 'Report Card'].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => {
                                if (tab === 'Report Card') navigate('/school/exams/report-cards');
                                else setActiveTab(tab);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab 1: Subject-Wise Result Table matching Screen 9 */}
            {activeTab === 'Subject-wise Result' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Academic Subject Performance</h3>
                            <p className="text-xs text-slate-500">Graded according to CBSE 9-Point Scale standards.</p>
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                            Passing Criterion: 33% per subject
                        </span>
                    </div>

                    <div className="overflow-x-auto print:overflow-visible">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs uppercase font-extrabold tracking-wider">
                                    <th className="py-3.5 px-5">Subject</th>
                                    <th className="py-3.5 px-4 text-center">Marks Obtained</th>
                                    <th className="py-3.5 px-4 text-center">Max Marks</th>
                                    <th className="py-3.5 px-4 text-center">Percentage</th>
                                    <th className="py-3.5 px-4 text-center">Grade</th>
                                    <th className="py-3.5 px-4 text-center">Status</th>
                                    <th className="py-3.5 px-5 min-w-[200px]">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {student.subjects.map((sub) => (
                                    <tr key={sub.subject} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-5 font-bold text-slate-900">
                                            {sub.subject}
                                        </td>
                                        <td className="py-4 px-4 text-center font-extrabold text-slate-900 text-sm">
                                            {sub.marks}
                                        </td>
                                        <td className="py-4 px-4 text-center font-semibold text-slate-400">
                                            {sub.maxMarks}
                                        </td>
                                        <td className="py-4 px-4 text-center font-bold text-blue-700">
                                            {sub.percentage}%
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
                                                {sub.grade}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                                                <CheckCircle2 className="w-3 h-3" /> Pass
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-slate-600 font-medium">
                                            {sub.remarks}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-slate-200 bg-slate-50/80 font-extrabold text-xs text-slate-900">
                                    <td className="py-4 px-5 uppercase">Total Aggregate</td>
                                    <td className="py-4 px-4 text-center text-blue-700 text-sm">{student.totalMarks}</td>
                                    <td className="py-4 px-4 text-center text-slate-500">{student.maxMarks}</td>
                                    <td className="py-4 px-4 text-center text-blue-800 text-sm">{student.percentage}%</td>
                                    <td className="py-4 px-4 text-center text-emerald-700 text-sm">{student.grade}</td>
                                    <td className="py-4 px-4 text-center text-emerald-700">PASS</td>
                                    <td className="py-4 px-5 text-slate-500 font-normal">Rank 1 in Class 10 - A</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab 2: Performance Analysis */}
            {activeTab === 'Performance Analysis' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                        <h4 className="font-extrabold text-slate-900 text-sm">Subject Scores vs Class Average</h4>
                        <div className="space-y-4 pt-2">
                            {student.subjects.map((sub) => {
                                const classAvg = 76;
                                return (
                                    <div key={sub.subject} className="space-y-1">
                                        <div className="flex justify-between text-xs font-bold text-slate-700">
                                            <span>{sub.subject}</span>
                                            <span>{sub.marks}% (Class Avg: {classAvg}%)</span>
                                        </div>
                                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                                            <div
                                                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${sub.marks}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                        <h4 className="font-extrabold text-slate-900 text-sm">Skill Domain Competencies</h4>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
                                <span className="text-[11px] font-semibold text-slate-500">Problem Solving</span>
                                <div className="text-lg font-extrabold text-blue-700 mt-1">98% (Exemplary)</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                                <span className="text-[11px] font-semibold text-slate-500">Concept Retention</span>
                                <div className="text-lg font-extrabold text-indigo-700 mt-1">95% (Exemplary)</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                                <span className="text-[11px] font-semibold text-slate-500">Practical Application</span>
                                <div className="text-lg font-extrabold text-emerald-700 mt-1">94% (Mastery)</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                                <span className="text-[11px] font-semibold text-slate-500">Written Presentation</span>
                                <div className="text-lg font-extrabold text-purple-700 mt-1">92% (High)</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 3: Attendance */}
            {activeTab === 'Attendance' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <h4 className="font-extrabold text-slate-900 text-sm">Academic Attendance Profile</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                            <span className="text-xs text-slate-500 font-semibold">Attendance Rate</span>
                            <div className="text-2xl font-extrabold text-emerald-700 mt-1">96.5%</div>
                            <span className="text-[11px] text-emerald-600 font-bold">185 / 192 working days</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <span className="text-xs text-slate-500 font-semibold">Approved Leaves</span>
                            <div className="text-2xl font-extrabold text-slate-700 mt-1">7 Days</div>
                            <span className="text-[11px] text-slate-400 font-medium">Medical sanction</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                            <span className="text-xs text-slate-500 font-semibold">Exam Eligibility</span>
                            <div className="text-2xl font-extrabold text-blue-700 mt-1">Eligible ✓</div>
                            <span className="text-[11px] text-blue-600 font-medium">Exceeds 75% CBSE requirement</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 4: Remarks */}
            {activeTab === 'Remarks' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <h4 className="font-extrabold text-slate-900 text-sm">Teacher Evaluation & Observations</h4>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                            <span>Class Teacher: Mrs. Sunita Paul</span>
                            <span>Recorded: 15 Oct 2026</span>
                        </div>
                        <p className="text-sm text-slate-700 italic leading-relaxed">
                            "{student.teacherRemarks}"
                        </p>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
