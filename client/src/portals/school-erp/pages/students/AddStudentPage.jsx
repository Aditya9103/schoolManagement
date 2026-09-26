import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    BookOpen,
    Users,
    UploadCloud,
    Bus,
} from 'lucide-react';
import { useCreateStudentMutation } from '../../../../store/api/studentApi';
import { useGetClassesQuery, useGetAcademicYearsQuery } from '../../../../store/api/classApi';
import { useUploadImageMutation } from '../../../../store/api/uploadApi';
import toast from 'react-hot-toast';

export default function AddStudentPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const { data: classesRes } = useGetClassesQuery();
    const classes = classesRes?.data || [];

    const { data: yearsRes } = useGetAcademicYearsQuery();
    const rawYears = yearsRes?.data;
    const academicYears = Array.isArray(rawYears) ? rawYears : (rawYears?.academicYears || []);
    const activeYear = rawYears?.currentAcademicYear || academicYears.find((y) => y.isCurrent) || academicYears[0];

    const [createStudent, { isLoading: isSubmitting }] = useCreateStudentMutation();
    const [uploadImage] = useUploadImageMutation();

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Personal
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'MALE',
        bloodGroup: 'O+',
        photoUrl: '',

        // Step 2: Academic
        classId: '',
        sectionId: '',
        admissionNo: '',
        rollNo: '',
        academicYear: '',
        academicYearId: '',

        // Step 3: Parents
        fatherName: '',
        fatherPhone: '',
        fatherOccupation: '',
        motherName: '',
        motherPhone: '',
        motherOccupation: '',
        emergencyContact: '',
        address: '',

        // Step 4: Transport
        busRouteNo: 'Bus No. 3',
        busStop: '',
    });

    useEffect(() => {
        if (activeYear) {
            setFormData((prev) => ({
                ...prev,
                academicYear: prev.academicYear || activeYear.name,
                academicYearId: prev.academicYearId || activeYear._id,
            }));
        }
    }, [activeYear]);

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Auto update sections when class changes
    const selectedClass = classes.find((c) => c._id === formData.classId);
    const availableSections = selectedClass?.sections || [];

    // Handle AWS S3 Photo Upload via RTK Query uploadApi
    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingPhoto(true);
            const data = new FormData();
            data.append('file', file);
            data.append('folder', 'students/photos');

            const res = await uploadImage(data).unwrap();
            const url = res?.data?.url || res?.url;

            if (url) {
                updateField('photoUrl', url);
                toast.success('Photo uploaded successfully!');
            }
        } catch (err) {
            console.error('Failed to upload photo to S3:', err);
            toast.error(err?.data?.message || err?.message || 'Failed to upload image. Please try again.');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                rollNo: formData.rollNo ? Number(formData.rollNo) : undefined,
            };
            const res = await createStudent(payload).unwrap();
            const studentId = res?.data?._id;
            if (studentId) {
                navigate(`/school/students/${studentId}`);
            } else {
                navigate('/school/students');
            }
        } catch (err) {
            console.error('Failed to create student:', err);
            alert(err?.data?.message || 'Failed to create student. Please verify all fields.');
        }
    };

    return (
        <div className="min-h-full bg-slate-50 flex flex-col pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-20 shadow-xs flex items-center justify-between">
                <button
                    onClick={() => navigate('/school/students')}
                    className="p-1.5 -ml-1.5 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-base font-bold text-slate-900 font-display">New Admission</h1>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    Step {step} of 4
                </span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="px-4 pt-4">
                <div className="flex items-center justify-between gap-1 mb-4">
                    {[
                        { num: 1, label: 'Student' },
                        { num: 2, label: 'Academic' },
                        { num: 3, label: 'Parents' },
                        { num: 4, label: 'Review' },
                    ].map((s) => (
                        <div key={s.num} className="flex-1 flex flex-col items-center">
                            <div
                                className={`h-2 w-full rounded-full transition-all ${
                                    step >= s.num ? 'bg-blue-600' : 'bg-slate-200'
                                }`}
                            />
                            <span
                                className={`text-[10px] mt-1 font-semibold ${
                                    step === s.num ? 'text-blue-700' : 'text-slate-400'
                                }`}
                            >
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content Container */}
            <div className="px-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
                    {/* Step 1: Student Information */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <User size={16} className="text-blue-600" />
                                Student Basic Information
                            </h3>

                            {/* Photo Upload with S3 */}
                            <div className="flex items-center gap-4 py-2">
                                <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-200 flex items-center justify-center shrink-0">
                                    {formData.photoUrl ? (
                                        <img
                                            src={formData.photoUrl}
                                            alt="Student Avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User size={24} className="text-slate-600 font-medium" />
                                    )}
                                </div>
                                <div>
                                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold cursor-pointer transition-all">
                                        <UploadCloud size={14} />
                                        {uploadingPhoto ? 'Uploading to S3...' : 'Upload Student Photo'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            disabled={uploadingPhoto}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-[10px] text-slate-600 font-semibold mt-1">
                                        PNG, JPG up to 5MB (Stored in AWS S3)
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Aarav"
                                        value={formData.firstName}
                                        onChange={(e) => updateField('firstName', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Sharma"
                                        value={formData.lastName}
                                        onChange={(e) => updateField('lastName', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Date of Birth *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.dateOfBirth}
                                        onChange={(e) => updateField('dateOfBirth', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Gender *
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => updateField('gender', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white"
                                    >
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                    Blood Group
                                </label>
                                <select
                                    value={formData.bloodGroup}
                                    onChange={(e) => updateField('bloodGroup', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white"
                                >
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Academic Assignment */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <BookOpen size={16} className="text-blue-600" />
                                Class & Academic Assignment
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Class *
                                    </label>
                                    <select
                                        required
                                        value={formData.classId}
                                        onChange={(e) => {
                                            updateField('classId', e.target.value);
                                            updateField('sectionId', '');
                                        }}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Section *
                                    </label>
                                    <select
                                        required
                                        disabled={!formData.classId}
                                        value={formData.sectionId}
                                        onChange={(e) => updateField('sectionId', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white disabled:bg-slate-100"
                                    >
                                        <option value="">Select Section</option>
                                        {availableSections.map((s) => (
                                            <option key={s._id} value={s._id}>
                                                Section {s.name} (Room {s.roomNumber || 'N/A'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Admission No (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Auto-generated if empty"
                                        value={formData.admissionNo}
                                        onChange={(e) => updateField('admissionNo', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Roll No (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Auto-incremented"
                                        value={formData.rollNo}
                                        onChange={(e) => updateField('rollNo', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                    Academic Session *
                                </label>
                                <select
                                    value={formData.academicYearId || ''}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        const found = academicYears.find((y) => y._id === selectedId);
                                        setFormData((prev) => ({
                                            ...prev,
                                            academicYearId: selectedId,
                                            academicYear: found ? found.name : prev.academicYear,
                                        }));
                                    }}
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white cursor-pointer font-medium"
                                >
                                    {academicYears.map((yr) => (
                                        <option key={yr._id} value={yr._id}>
                                            Academic Year {yr.name} {yr.isCurrent ? '★ (Current)' : ''}
                                        </option>
                                    ))}
                                </select>
                                {formData.academicYearId && (
                                    <p className="mt-1 text-[10px] font-mono text-slate-600 font-semibold">
                                        ID: {formData.academicYearId}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Parents & Guardian */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Users size={16} className="text-blue-600" />
                                Parent & Emergency Contact
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Father's Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Rajesh Sharma"
                                        value={formData.fatherName}
                                        onChange={(e) => updateField('fatherName', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Father's Phone
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={formData.fatherPhone}
                                        onChange={(e) => updateField('fatherPhone', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Mother's Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Neha Sharma"
                                        value={formData.motherName}
                                        onChange={(e) => updateField('motherName', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Emergency Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+91 98765 43210"
                                        value={formData.emergencyContact}
                                        onChange={(e) => updateField('emergencyContact', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                    Residential Address
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. 123, Green Park, Noida, Uttar Pradesh"
                                    value={formData.address}
                                    onChange={(e) => updateField('address', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Transport & Review */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Bus size={16} className="text-blue-600" />
                                Transport & Review
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Bus Route
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.busRouteNo}
                                        onChange={(e) => updateField('busRouteNo', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-800 font-bold block mb-1">
                                        Pickup Stop
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sunshine Homes"
                                        value={formData.busStop}
                                        onChange={(e) => updateField('busStop', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Review Box */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs space-y-1.5">
                                <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">
                                    Enrollment Summary
                                </h4>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Student:</span>
                                    <span className="font-semibold text-slate-800">
                                        {formData.firstName} {formData.lastName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Class & Section:</span>
                                    <span className="font-semibold text-slate-800">
                                        {selectedClass?.name || 'Class'} - {availableSections.find((s) => s._id === formData.sectionId)?.name || 'Section'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">DOB & Blood Group:</span>
                                    <span className="font-semibold text-slate-800">
                                        {formData.dateOfBirth} ({formData.bloodGroup})
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Emergency:</span>
                                    <span className="font-semibold text-blue-600">
                                        {formData.emergencyContact || formData.fatherPhone || 'Not set'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep((s) => s - 1)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                Back
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={() => {
                                    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.dateOfBirth)) {
                                        alert('Please fill in First Name, Last Name, and Date of Birth');
                                        return;
                                    }
                                    if (step === 2 && (!formData.classId || !formData.sectionId)) {
                                        alert('Please select both Class and Section');
                                        return;
                                    }
                                    setStep((s) => s + 1);
                                }}
                                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-md shadow-blue-500/20 transition-all"
                            >
                                Next Step →
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Enrolling...' : 'Confirm & Enroll Student'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
