import React from 'react';
import { MoreVertical, Eye, Award, ExternalLink } from 'lucide-react';

export default function RecentResultsTable({
    results = [],
    onViewAllResults,
    onViewStudentResult,
}) {
    const defaultResults = [
        {
            id: '1',
            studentName: 'Aarav Sharma',
            rollNo: '101',
            className: '10 - A',
            examName: 'Half Yearly',
            totalMaxMarks: 500,
            totalMarksObtained: 472,
            percentage: 94.4,
            grade: 'A+',
            resultStatus: 'PASS',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        },
        {
            id: '2',
            studentName: 'Ananya Verma',
            rollNo: '102',
            className: '9 - B',
            examName: 'Unit Test 1',
            totalMaxMarks: 100,
            totalMarksObtained: 88,
            percentage: 88.0,
            grade: 'A',
            resultStatus: 'PASS',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        },
        {
            id: '3',
            studentName: 'Rohan Patel',
            rollNo: '103',
            className: '8 - A',
            examName: 'Unit Test 1',
            totalMaxMarks: 100,
            totalMarksObtained: 76,
            percentage: 76.0,
            grade: 'B+',
            resultStatus: 'PASS',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        },
        {
            id: '4',
            studentName: 'Sneha Gupta',
            rollNo: '104',
            className: '7 - A',
            examName: 'Unit Test 1',
            totalMaxMarks: 100,
            totalMarksObtained: 92,
            percentage: 92.0,
            grade: 'A+',
            resultStatus: 'PASS',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        },
        {
            id: '5',
            studentName: 'Vihaan Singh',
            rollNo: '105',
            className: '10 - B',
            examName: 'Half Yearly',
            totalMaxMarks: 500,
            totalMarksObtained: 315,
            percentage: 63.0,
            grade: 'B',
            resultStatus: 'PASS',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        },
    ];

    const displayList = results.length > 0 ? results : defaultResults;

    const renderGradeBadge = (grade = 'A') => {
        const g = grade.toUpperCase();
        if (g === 'A+') return 'bg-sky-50 text-sky-700 border-sky-200';
        if (g === 'A') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (g === 'B+') return 'bg-blue-50 text-blue-700 border-blue-200';
        if (g === 'B') return 'bg-purple-50 text-purple-700 border-purple-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Header bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-display">
                    Recent Results
                </h3>
                <button
                    type="button"
                    onClick={onViewAllResults}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                    <span>View All</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[750px]">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-3 px-3.5 w-10 text-center shrink-0">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th className="py-3 px-3 w-10 text-slate-400 text-center shrink-0">#</th>
                            <th className="py-3 px-3.5 min-w-[180px]">Student Name</th>
                            <th className="py-3 px-3.5 min-w-[100px]">Class</th>
                            <th className="py-3 px-3.5 min-w-[120px]">Exam</th>
                            <th className="py-3 px-3.5 min-w-[100px]">Total Marks</th>
                            <th className="py-3 px-3.5 min-w-[100px]">Obtained</th>
                            <th className="py-3 px-3.5 min-w-[100px]">Percentage</th>
                            <th className="py-3 px-3.5 min-w-[80px]">Grade</th>
                            <th className="py-3 px-3.5 min-w-[110px]">Result Status</th>
                            <th className="py-3 px-3 w-12 text-center shrink-0">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {displayList.map((item, idx) => {
                            const studentName = item.studentName || 'Student';
                            const className = item.className?.replace('Class ', '') || '10 - A';
                            const examName = item.examName || 'Unit Test';
                            const totalMax = item.totalMaxMarks || 100;
                            const obtained = item.totalMarksObtained ?? item.marksObtained ?? 85;
                            const pct = item.percentage ?? ((obtained / totalMax) * 100).toFixed(1);
                            const grade = item.overallGrade || item.grade || 'A';

                            return (
                                <tr
                                    key={item._id || item.id || idx}
                                    className="hover:bg-slate-50/80 transition-colors"
                                >
                                    <td className="py-3.5 px-3.5 text-center shrink-0">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>
                                    <td className="py-3.5 px-3 text-center text-xs font-semibold text-slate-400">
                                        {idx + 1}
                                    </td>

                                    {/* Student Name with Avatar */}
                                    <td className="py-3.5 px-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                src={
                                                    item.avatar ||
                                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentName}`
                                                }
                                                alt={studentName}
                                                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                                            />
                                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                                {studentName}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-3.5 text-xs text-slate-700 font-medium">
                                        {className}
                                    </td>

                                    <td className="py-3.5 px-3.5 text-xs text-slate-700 font-medium">
                                        {examName}
                                    </td>

                                    <td className="py-3.5 px-3.5 text-xs font-semibold text-slate-500">
                                        {totalMax}
                                    </td>

                                    <td className="py-3.5 px-3.5 text-xs font-extrabold text-slate-900">
                                        {obtained}
                                    </td>

                                    <td className="py-3.5 px-3.5 text-xs font-extrabold text-blue-600">
                                        {pct}%
                                    </td>

                                    <td className="py-3.5 px-3.5">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${renderGradeBadge(grade)}`}>
                                            {grade}
                                        </span>
                                    </td>

                                    <td className="py-3.5 px-3.5">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Pass
                                        </span>
                                    </td>

                                    <td className="py-3.5 px-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => onViewStudentResult && onViewStudentResult(item)}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                            title="View Student Result Details"
                                        >
                                            <Eye className="w-4 h-4 text-blue-600" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
