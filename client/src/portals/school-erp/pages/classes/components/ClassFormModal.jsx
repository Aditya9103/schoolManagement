import React, { useState, useEffect } from 'react';
import {
    X,
    BookOpen,
    UploadCloud,
    Image as ImageIcon,
    CheckCircle2,
    AlertCircle,
    UserCheck,
    Layers,
    Sparkles,
} from 'lucide-react';
import {
    useCreateClassMutation,
    useUpdateClassMutation,
    useGetStaffTeachersQuery,
} from '../../../../../store/api/classApi';
import { useUploadImageMutation } from '../../../../../store/api/uploadApi';
import toast from 'react-hot-toast';

const GRADE_LEVELS = [
    { value: 'PRE_PRIMARY', label: 'Pre-Primary (Nursery, LKG, UKG)' },
    { value: 'PRIMARY', label: 'Primary (Class 1 - 5)' },
    { value: 'MIDDLE', label: 'Middle (Class 6 - 8)' },
    { value: 'SECONDARY', label: 'Secondary (Class 9 - 10)' },
    { value: 'SENIOR_SECONDARY', label: 'Senior Secondary (Class 11 - 12)' },
];

const STREAMS = [
    { value: 'GENERAL', label: 'General Curriculum' },
    { value: 'SCIENCE', label: 'Science (PCM / PCB)' },
    { value: 'COMMERCE', label: 'Commerce' },
    { value: 'ARTS', label: 'Arts & Humanities' },
];

const DEFAULT_BANNERS = [
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
];

export default function ClassFormModal({ isOpen, onClose, classToEdit = null }) {
    const [createClass, { isLoading: isCreating }] = useCreateClassMutation();
    const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

    const { data: staffRes } = useGetStaffTeachersQuery();
    const staffList = staffRes?.data || [];

    const isEditMode = !!classToEdit;

    const [formData, setFormData] = useState({
        name: '',
        classCode: '',
        gradeLevel: 'PRIMARY',
        numericGrade: 1,
        stream: 'GENERAL',
        defaultCapacity: 30,
        tagline: 'Building strong foundations for a brighter future',
        classTeacherId: '',
        bannerUrl: '',
        iconUrl: '',
        orderIndex: 1,
    });

    const [error, setError] = useState('');
    const [bannerPreview, setBannerPreview] = useState('');
    const [iconPreview, setIconPreview] = useState('');

    useEffect(() => {
        if (classToEdit) {
            setFormData({
                name: classToEdit.name || '',
                classCode: classToEdit.classCode || '',
                gradeLevel: classToEdit.gradeLevel || 'PRIMARY',
                numericGrade: classToEdit.numericGrade || 1,
                stream: classToEdit.stream || 'GENERAL',
                defaultCapacity: classToEdit.defaultCapacity || 30,
                tagline: classToEdit.tagline || 'Building strong foundations for a brighter future',
                classTeacherId: classToEdit.classTeacherId?._id || classToEdit.classTeacherId || '',
                bannerUrl: classToEdit.bannerUrl || classToEdit.coverImageUrl || '',
                iconUrl: classToEdit.iconUrl || '',
                orderIndex: classToEdit.orderIndex || 1,
            });
            setBannerPreview(classToEdit.bannerUrl || classToEdit.coverImageUrl || '');
            setIconPreview(classToEdit.iconUrl || '');
        } else {
            setFormData({
                name: '',
                classCode: '',
                gradeLevel: 'PRIMARY',
                numericGrade: 1,
                stream: 'GENERAL',
                defaultCapacity: 30,
                tagline: 'Building strong foundations for a brighter future',
                classTeacherId: staffList[0]?._id || '',
                bannerUrl: DEFAULT_BANNERS[0],
                iconUrl: '',
                orderIndex: 1,
            });
            setBannerPreview(DEFAULT_BANNERS[0]);
            setIconPreview('');
        }
    }, [classToEdit, isOpen, staffList]);

    if (!isOpen) return null;

    // Handle real file upload for banner
    const handleBannerFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('folder', 'classes/banners');

            const res = await uploadImage(uploadData).unwrap();
            const uploadedUrl = res.data?.url || res.data?.fileUrl;

            setBannerPreview(uploadedUrl);
            setFormData((prev) => ({
                ...prev,
                bannerUrl: uploadedUrl,
                coverImageUrl: uploadedUrl,
            }));
            toast.success('Class banner uploaded successfully!');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to upload banner');
        }
    };

    // Handle real file upload for icon
    const handleIconFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('folder', 'classes/icons');

            const res = await uploadImage(uploadData).unwrap();
            const uploadedUrl = res.data?.url || res.data?.fileUrl;

            setIconPreview(uploadedUrl);
            setFormData((prev) => ({
                ...prev,
                iconUrl: uploadedUrl,
            }));
            toast.success('Class icon uploaded successfully!');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to upload icon');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Class Name is required');
            return;
        }

        try {
            const payload = {
                ...formData,
                name: formData.name.trim(),
                classCode: formData.classCode.trim().toUpperCase() || formData.name.substring(0, 3).toUpperCase(),
                defaultCapacity: Number(formData.defaultCapacity) || 30,
                numericGrade: Number(formData.numericGrade) || (parseInt(formData.name.replace(/\D/g, ''), 10) || 1),
                coverImageUrl: formData.bannerUrl || DEFAULT_BANNERS[0],
                bannerUrl: formData.bannerUrl || DEFAULT_BANNERS[0],
                classTeacherId: formData.classTeacherId || null,
            };

            if (isEditMode) {
                await updateClass({ id: classToEdit._id, ...payload }).unwrap();
                toast.success(`Class ${formData.name} updated successfully!`);
            } else {
                await createClass(payload).unwrap();
                toast.success(`Class ${formData.name} created successfully!`);
            }

            onClose();
        } catch (err) {
            setError(err?.data?.message || err?.message || 'Failed to save class');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">
                                {isEditMode ? `Edit Class: ${classToEdit.name}` : 'Add New Class'}
                            </h2>
                            <p className="text-xs text-blue-100">
                                {isEditMode ? 'Modify class properties, capacity, banner & educator' : 'Create an academic grade and section structure'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-semibold">
                            <AlertCircle size={15} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Class Banner Upload Section */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            Class Banner Image (Header Cover)
                        </label>
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-32 flex items-center justify-center group">
                            {bannerPreview ? (
                                <img
                                    src={bannerPreview}
                                    alt="Class Banner"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center p-4">
                                    <ImageIcon size={28} className="mx-auto text-slate-600 font-medium mb-1" />
                                    <p className="text-xs text-slate-700 font-medium">No banner uploaded</p>
                                </div>
                            )}

                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-2xs">
                                <UploadCloud size={24} className="mb-1" />
                                <span className="text-xs font-bold">Upload Custom Banner</span>
                                <span className="text-[10px] text-white/80">PNG, JPG up to 5MB</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBannerFileChange}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </label>
                        </div>

                        {/* Preset themes selection */}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] font-semibold text-slate-600">Presets:</span>
                            {DEFAULT_BANNERS.map((bUrl, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        setBannerPreview(bUrl);
                                        setFormData((prev) => ({ ...prev, bannerUrl: bUrl, coverImageUrl: bUrl }));
                                    }}
                                    className={`w-9 h-6 rounded-md overflow-hidden border-2 transition-transform ${
                                        bannerPreview === bUrl ? 'border-blue-600 scale-105 ring-1 ring-blue-500' : 'border-slate-200'
                                    }`}
                                >
                                    <img src={bUrl} alt="Preset" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Class Name & Class Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Class / Grade Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Class 1, Grade 10"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Class Code
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. C1, NUR, G10"
                                value={formData.classCode}
                                onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase font-mono"
                            />
                        </div>
                    </div>

                    {/* Grade Level & Stream */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Grade Level
                            </label>
                            <select
                                value={formData.gradeLevel}
                                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                                {GRADE_LEVELS.map((g) => (
                                    <option key={g.value} value={g.value}>{g.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Curriculum Stream
                            </label>
                            <select
                                value={formData.stream}
                                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                                {STREAMS.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Class Teacher Dropdown */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                            Assigned Class Teacher (Educator In-Charge)
                        </label>
                        <select
                            value={formData.classTeacherId}
                            onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                            <option value="">-- No Teacher Assigned --</option>
                            {staffList.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.name} ({teacher.designation || 'Educator'}) - {teacher.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Section Capacity & Sort Order */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Default Section Capacity (Students)
                            </label>
                            <input
                                type="number"
                                min="5"
                                max="100"
                                value={formData.defaultCapacity}
                                onChange={(e) => setFormData({ ...formData, defaultCapacity: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Sort Order Index
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.orderIndex}
                                onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Tagline / Motivational Quote */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                            Class Tagline / Motivational Quote
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Building strong foundations for lifelong learning"
                            value={formData.tagline}
                            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>


                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || isUpdating || isUploading}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isCreating || isUpdating ? 'Saving...' : (isEditMode ? 'Update Class' : 'Create Class')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
