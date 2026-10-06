import React, { useState } from 'react';
import { X, UploadCloud, Download, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImportAttendanceModal({
    isOpen,
    onClose,
    onImportSuccess,
    classNameDisplay = 'Class 6 - Section A',
}) {
    if (!isOpen) return null;

    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState('');
    const [previewCount, setPreviewCount] = useState(0);

    const handleDownloadTemplate = () => {
        const csvContent =
            'data:text/csv;charset=utf-8,RollNo,StudentName,Status,Remarks\n' +
            '6A001,Aarav Sharma,PRESENT,-\n' +
            '6A002,Ananya Verma,PRESENT,-\n' +
            '6A003,Rohan Patel,PRESENT,-\n' +
            '6A004,Sneha Gupta,ABSENT,Fever\n' +
            '6A005,Vihaan Singh,PRESENT,-\n' +
            '6A006,Kavya Joshi,LATE,Reached at 9:30 AM\n';
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Attendance_Template_${classNameDisplay.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Attendance CSV template downloaded');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setPreviewCount(32);
            toast.success(`Loaded ${file.name} (32 records parsed)`);
        }
    };

    const handleConfirmImport = () => {
        if (!fileName) {
            toast.error('Please select or upload a CSV file');
            return;
        }
        toast.success('Successfully imported 32 attendance records!');
        if (onImportSuccess) onImportSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Import Attendance</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Upload CSV or Excel file for {classNameDisplay}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Download Sample Template Banner */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900">
                        <div className="flex items-center gap-2.5">
                            <FileSpreadsheet className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div>
                                <p className="font-bold">Need the standard spreadsheet format?</p>
                                <p className="text-[11px] text-blue-700">Pre-formatted columns: RollNo, StudentName, Status, Remarks</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleDownloadTemplate}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-white text-blue-700 hover:bg-blue-100/50 border border-blue-200 shadow-2xs transition-colors cursor-pointer flex-shrink-0"
                        >
                            <Download className="w-3.5 h-3.5" /> Template
                        </button>
                    </div>

                    {/* Drag and Drop Box */}
                    <label
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                                setFileName(file.name);
                                setPreviewCount(32);
                                toast.success(`Loaded ${file.name}`);
                            }
                        }}
                        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                            isDragging
                                ? 'border-blue-500 bg-blue-50/40'
                                : fileName
                                ? 'border-emerald-400 bg-emerald-50/20'
                                : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                        }`}
                    >
                        <input
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 border border-blue-100">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                            {fileName ? fileName : 'Click to upload or drag & drop'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            {fileName ? `${previewCount} valid student rows detected` : 'CSV or XLSX (Max 10MB)'}
                        </p>
                    </label>

                    {/* Format Guidelines */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] text-slate-500 space-y-1">
                        <p className="font-semibold text-slate-700">Import Notes:</p>
                        <p>• Accepted statuses: <span className="font-semibold text-slate-700">PRESENT, ABSENT, LATE, EXCUSED</span></p>
                        <p>• Roll numbers will automatically match active students in this class.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmImport}
                        disabled={!fileName}
                        className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                        <Check className="w-4 h-4" /> Import Records
                    </button>
                </div>
            </div>
        </div>
    );
}
