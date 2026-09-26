import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Info, ArrowRight, School, Image as ImageIcon } from 'lucide-react';
import { useUploadImageMutation } from '../../../../../store/api/uploadApi';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
    'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Delhi', 'Rajasthan',
    'Telangana', 'Tamil Nadu', 'Gujarat', 'Haryana', 'West Bengal',
    'Madhya Pradesh', 'Kerala', 'Punjab', 'Bihar', 'Odisha', 'Assam',
];

export default function StepBasicInfo({ form, onChange, onNext }) {
    const [uploadImage] = useUploadImageMutation();
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);

    // Handle AWS S3 Logo Upload via RTK Query uploadApi
    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingLogo(true);
            const data = new FormData();
            data.append('file', file);
            data.append('folder', 'schools/logos');

            const res = await uploadImage(data).unwrap();
            const url = res?.data?.url || res?.url;
            if (url) {
                onChange('logoUrl', url);
                toast.success('School logo uploaded successfully!');
            }
        } catch (err) {
            console.error('Logo upload error:', err);
            toast.error(err?.data?.message || err?.message || 'Failed to upload logo to S3. Please try again.');
        } finally {
            setUploadingLogo(false);
        }
    };

    // Handle AWS S3 Cover Image Upload via RTK Query uploadApi
    const handleCoverUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingCover(true);
            const data = new FormData();
            data.append('file', file);
            data.append('folder', 'schools/covers');

            const res = await uploadImage(data).unwrap();
            const url = res?.data?.url || res?.url;
            if (url) {
                onChange('coverImageUrl', url);
                toast.success('School cover image uploaded successfully!');
            }
        } catch (err) {
            console.error('Cover upload error:', err);
            toast.error(err?.data?.message || err?.message || 'Failed to upload cover image to S3. Please try again.');
        } finally {
            setUploadingCover(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.code || !form.contactEmail || !form.contactPhone) {
            toast.error('Please fill in all required fields (marked with *).');
            return;
        }
        onNext();
    };

    return (
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols): Basic Information Form matching Image 3 */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                <div>
                    <h3 className="text-lg font-black text-slate-900 font-display">Basic Information</h3>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">Enter the essential details of the school.</p>
                </div>

                {/* School Name & Short Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            School Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="E.g. Greenwood International School"
                            value={form.name || ''}
                            onChange={(e) => onChange('name', e.target.value)}
                            className="w-full h-11 px-3.5 text-sm font-medium bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 text-slate-900 placeholder:text-slate-500 transition-all shadow-2xs"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            Short Name / Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="E.g. GWS"
                            value={form.code || ''}
                            onChange={(e) => onChange('code', e.target.value.toUpperCase())}
                            className="w-full h-11 px-3.5 text-sm font-bold bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 uppercase font-mono text-slate-900 placeholder:text-slate-500 font-medium transition-all shadow-2xs"
                        />
                    </div>
                </div>

                {/* Tagline & School Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            Tagline
                        </label>
                        <input
                            type="text"
                            placeholder="E.g. Nurturing Future Leaders"
                            value={form.tagline || ''}
                            onChange={(e) => onChange('tagline', e.target.value)}
                            className="w-full h-11 px-3.5 text-sm font-medium bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 text-slate-900 placeholder:text-slate-500 transition-all shadow-2xs"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            School Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={form.schoolType || 'K-12 School'}
                            onChange={(e) => onChange('schoolType', e.target.value)}
                            className="w-full h-11 px-3.5 text-sm font-semibold bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 text-slate-900 transition-all shadow-2xs cursor-pointer"
                        >
                            <option value="K-12 School">K-12 School</option>
                            <option value="Primary School">Primary School</option>
                            <option value="High School">High School</option>
                            <option value="Play School / Pre-K">Play School / Pre-K</option>
                            <option value="Higher Secondary">Higher Secondary</option>
                        </select>
                    </div>
                </div>

                {/* Email Address & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="contact@school.edu.in"
                            value={form.contactEmail || ''}
                            onChange={(e) => onChange('contactEmail', e.target.value)}
                            className="w-full h-11 px-3.5 text-sm font-medium bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 text-slate-900 placeholder:text-slate-500 transition-all shadow-2xs"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={form.contactPhone || ''}
                            onChange={(e) => onChange('contactPhone', e.target.value)}
                            className="w-full h-11 px-3.5 text-sm font-medium bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 text-slate-900 placeholder:text-slate-500 transition-all shadow-2xs"
                        />
                    </div>
                </div>

                {/* Website & Establishment Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            Website (Optional)
                        </label>
                        <input
                            type="url"
                            placeholder="https://www.school.edu.in"
                            value={form.website || ''}
                            onChange={(e) => onChange('website', e.target.value)}
                            className="w-full h-11 px-3.5 text-sm font-medium bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 text-slate-900 placeholder:text-slate-500 transition-all shadow-2xs"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            Establishment Year
                        </label>
                        <select
                            value={form.establishedYear || '2015'}
                            onChange={(e) => onChange('establishedYear', Number(e.target.value))}
                            className="w-full h-11 px-3.5 text-sm font-semibold bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 text-slate-900 transition-all shadow-2xs cursor-pointer"
                        >
                            {Array.from({ length: 75 }, (_, i) => 2026 - i).map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Address Textarea */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold text-slate-800">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] font-semibold text-slate-700">
                            {(form.address?.line1 || '').length}/300
                        </span>
                    </div>
                    <textarea
                        rows={2}
                        required
                        maxLength={300}
                        placeholder="Enter complete institutional address..."
                        value={form.address?.line1 || ''}
                        onChange={(e) =>
                            onChange('address', { ...form.address, line1: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-sm font-medium bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 text-slate-900 placeholder:text-slate-500 transition-all shadow-2xs"
                    />
                </div>

                {/* Country, State, City, PIN Code */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <select
                            disabled
                            className="w-full h-11 px-3 text-xs font-bold border border-slate-300 rounded-xl bg-slate-100 text-slate-700 cursor-not-allowed"
                        >
                            <option value="India">🇮🇳 India</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            State <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={form.address?.state || 'Uttar Pradesh'}
                            onChange={(e) =>
                                onChange('address', { ...form.address, state: e.target.value })
                            }
                            className="w-full h-11 px-2.5 text-xs font-bold border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 bg-white text-slate-900 cursor-pointer shadow-2xs"
                        >
                            {INDIAN_STATES.map((st) => (
                                <option key={st} value={st}>
                                    {st}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Noida"
                            value={form.address?.city || ''}
                            onChange={(e) =>
                                onChange('address', { ...form.address, city: e.target.value })
                            }
                            className="w-full h-11 px-3 text-sm font-semibold border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 text-slate-900 placeholder:text-slate-500 font-medium shadow-2xs"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                            PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="201309"
                            maxLength={6}
                            value={form.address?.pincode || ''}
                            onChange={(e) =>
                                onChange('address', { ...form.address, pincode: e.target.value })
                            }
                            className="w-full h-11 px-3 text-sm font-bold border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 text-slate-900 font-mono shadow-2xs"
                        />
                    </div>
                </div>

                {/* Info Callout Box */}
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 font-medium">
                    <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        This information will be visible to school admins and used for official student reports, fee receipts, and institutional verification.
                    </p>
                </div>

                {/* Save & Continue Button */}
                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 h-11 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all"
                    >
                        Save & Continue <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Right Column (4 cols): Media Uploads, Quick Tips & Quote matching Image 3 */}
            <div className="lg:col-span-4 space-y-4">
                {/* 1. School Logo Upload Card */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-900">School Logo</h4>
                    <p className="text-[11px] text-slate-700 font-semibold font-medium mt-0.5 mb-3">
                        Recommended size: 512 x 512 px (PNG, JPG, SVG max 2MB)
                    </p>

                    <div className="flex items-center gap-3">
                        <label className="flex-1 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/20 group">
                            <UploadCloud
                                size={22}
                                className="text-slate-500 group-hover:text-blue-600 transition-colors mb-1"
                            />
                            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                                {uploadingLogo ? 'Uploading to S3...' : 'Drag & drop logo'}
                            </span>
                            <span className="text-[10px] text-slate-700 font-semibold font-medium">or click to browse</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={uploadingLogo}
                                className="hidden"
                            />
                        </label>

                        {/* Circular Preview Badge */}
                        <div className="shrink-0 flex flex-col items-center">
                            <div className="h-16 w-16 rounded-full bg-slate-100 ring-2 ring-slate-300 overflow-hidden flex items-center justify-center shadow-xs">
                                {form.logoUrl ? (
                                    <img
                                        src={form.logoUrl}
                                        alt="Logo Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <School size={24} className="text-slate-500" />
                                )}
                            </div>
                            <span className="text-[10px] text-slate-600 font-bold mt-1">Preview</span>
                        </div>
                    </div>
                </div>

                {/* 2. School Cover Image Upload Card */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-900">School Cover Image</h4>
                    <p className="text-[11px] text-slate-700 font-semibold font-medium mt-0.5 mb-3">
                        Recommended size: 1440 x 360 px (Max 5MB)
                    </p>

                    <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/20 group">
                        {form.coverImageUrl ? (
                            <div className="w-full h-24 rounded-xl overflow-hidden mb-2">
                                <img
                                    src={form.coverImageUrl}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <ImageIcon
                                size={22}
                                className="text-slate-500 group-hover:text-blue-600 transition-colors mb-1"
                            />
                        )}
                        <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                            {uploadingCover ? 'Uploading to S3...' : 'Drag & drop cover image'}
                        </span>
                        <span className="text-[10px] text-slate-700 font-semibold font-medium">or click to browse</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            disabled={uploadingCover}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* 3. Quick Tips Checklist */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-900 mb-2">Quick Tips</h4>
                    {[
                        'Use the official school name and registered address.',
                        'Upload a crisp, high-resolution logo and cover image.',
                        'Configure plans, modules and custom domain in next steps.',
                        'School can be activated immediately after creation.',
                    ].map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                            <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>{tip}</span>
                        </div>
                    ))}
                </div>

                {/* 4. Quote Card */}
                <div className="rounded-3xl p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/70 text-center shadow-xs">
                    <span className="text-lg">🎓</span>
                    <p className="text-xs font-semibold text-slate-800 italic mt-1">
                        "Building brighter minds, one school at a time."
                    </p>
                </div>
            </div>
        </form>
    );
}
