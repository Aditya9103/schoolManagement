import React, { useState, useEffect } from 'react';
import {
    Settings,
    Layers,
    Calendar,
    Award,
    CheckCircle2,
    Save,
    Plus,
    Check,
    AlertCircle,
} from 'lucide-react';
import {
    useGetClassSettingsQuery,
    useUpdateClassSettingsMutation,
    useGetAcademicYearsQuery,
    useCreateAcademicYearMutation,
    useSetCurrentAcademicYearMutation,
} from '../../../../store/api/classApi';
import toast from 'react-hot-toast';

const SETTINGS_TABS = [
    { id: 'class_config', label: 'Class Configuration', icon: Settings },
    { id: 'section_settings', label: 'Section Settings', icon: Layers },
    { id: 'academic_years', label: 'Academic Year Settings', icon: Calendar },
    { id: 'promotion', label: 'Promotion Settings', icon: Award },
];

export default function ClassSettingsPage() {
    const [activeTab, setActiveTab] = useState('class_config');

    // API Hooks
    const { data: settingsRes, isLoading } = useGetClassSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateClassSettingsMutation();

    const { data: yearsRes } = useGetAcademicYearsQuery();
    const rawYears = yearsRes?.data;
    const academicYears = Array.isArray(rawYears) ? rawYears : (rawYears?.academicYears || []);

    const [createYear, { isLoading: isCreatingYear }] = useCreateAcademicYearMutation();
    const [setCurrentYear] = useSetCurrentAcademicYearMutation();

    // Local form state
    const [formData, setFormData] = useState({
        defaultSectionsPerClass: 3,
        defaultCapacityPerSection: 30,
        sectionOrderBy: 'Alphabetical Order',
        autoPromoteThreshold: 40,
        enableClassroomCodes: true,
    });

    // New Academic Year form
    const [newYearName, setNewYearName] = useState('');
    const [newYearStart, setNewYearStart] = useState('');
    const [newYearEnd, setNewYearEnd] = useState('');

    useEffect(() => {
        if (settingsRes?.data) {
            setFormData((prev) => ({
                ...prev,
                ...settingsRes.data,
            }));
        }
    }, [settingsRes]);

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await updateSettings(formData).unwrap();
            toast.success('Class & Section settings updated successfully!');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to save settings');
        }
    };

    const handleCreateYear = async (e) => {
        e.preventDefault();
        if (!newYearName.trim()) {
            toast.error('Academic year name is required (e.g. 2026-27)');
            return;
        }

        try {
            await createYear({
                name: newYearName.trim(),
                startDate: newYearStart || new Date().toISOString(),
                endDate: newYearEnd || new Date().toISOString(),
                isCurrent: academicYears.length === 0,
            }).unwrap();
            toast.success(`Academic Year ${newYearName} created!`);
            setNewYearName('');
            setNewYearStart('');
            setNewYearEnd('');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to create academic year');
        }
    };

    const handleSetCurrentYear = async (yearId, yearName) => {
        try {
            await setCurrentYear(yearId).unwrap();
            toast.success(`Academic Year ${yearName} set as Current active year!`);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to set current academic year');
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 text-center">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-medium text-slate-700">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Settings size={22} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Academic & Section Settings</h2>
                        <p className="text-xs text-slate-700 font-medium">Configure global class defaults, capacities, academic terms and promotion thresholds</p>
                    </div>
                </div>
            </div>

            {/* Main Layout: Tabs on Left, Settings Form on Right */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Tabs Sidebar */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 h-fit">
                    {SETTINGS_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <Icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Settings Panel */}
                <div className="md:col-span-3">
                    {activeTab === 'class_config' && (
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Grade Levels & Class Parameters</h3>
                                <p className="text-xs text-slate-700 font-medium">Active educational divisions within the institution</p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-800 font-bold block">
                                        Enabled Grade Stages
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            'Pre-Primary (Nursery, LKG, UKG)',
                                            'Primary School (Class 1 to 5)',
                                            'Middle School (Class 6 to 8)',
                                            'Secondary School (Class 9 to 10)',
                                            'Senior Secondary (Class 11 to 12)',
                                        ].map((stage, i) => (
                                            <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center gap-2.5">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-xs font-semibold text-slate-800">{stage}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Auto-generate Class Codes</p>
                                        <p className="text-[11px] text-slate-600 font-semibold">Generate standard codes (e.g. C1, C2) automatically on class creation</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.enableClassroomCodes}
                                        onChange={(e) => setFormData({ ...formData, enableClassroomCodes: e.target.checked })}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={handleSaveSettings}
                                    disabled={isUpdating}
                                    className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
                                >
                                    <Save size={15} />
                                    <span>{isUpdating ? 'Saving...' : 'Save Configuration'}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'section_settings' && (
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Section Defaults & Capacities</h3>
                                <p className="text-xs text-slate-700 font-medium">Configure default divisions per class and classroom capacity thresholds</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                                        Default Sections per Class
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.defaultSectionsPerClass}
                                        onChange={(e) => setFormData({ ...formData, defaultSectionsPerClass: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                                        Default Capacity per Section
                                    </label>
                                    <input
                                        type="number"
                                        min="10"
                                        max="60"
                                        value={formData.defaultCapacityPerSection}
                                        onChange={(e) => setFormData({ ...formData, defaultCapacityPerSection: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                                        Section Sorting Order
                                    </label>
                                    <select
                                        value={formData.sectionOrderBy}
                                        onChange={(e) => setFormData({ ...formData, sectionOrderBy: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="Alphabetical Order">Alphabetical Order (A, B, C...)</option>
                                        <option value="Numeric Order">Numeric Order (1, 2, 3...)</option>
                                        <option value="Named Divisions">Named Divisions (Rose, Lotus, Lily...)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={handleSaveSettings}
                                    disabled={isUpdating}
                                    className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
                                >
                                    <Save size={15} />
                                    <span>{isUpdating ? 'Saving...' : 'Save Section Settings'}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'academic_years' && (
                        <div className="space-y-6">
                            {/* Academic Years List */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Academic Sessions</h3>
                                        <p className="text-xs text-slate-700 font-medium">Live academic years registered in the database</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {academicYears.length === 0 ? (
                                        <p className="text-xs text-slate-600 font-semibold py-4 text-center">No academic years configured.</p>
                                    ) : (
                                        academicYears.map((yr) => (
                                            <div
                                                key={yr._id}
                                                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                                                    yr.isCurrent
                                                        ? 'bg-blue-50/60 border-blue-400 shadow-xs'
                                                        : 'bg-white border-slate-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                                                        yr.isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        <Calendar size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-black text-slate-900">{yr.name}</h4>
                                                            {yr.isCurrent && (
                                                                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                                                                    Current Active Term
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-slate-700 font-semibold">
                                                            Status: {yr.status || 'Active'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {!yr.isCurrent && (
                                                    <button
                                                        onClick={() => handleSetCurrentYear(yr._id, yr.name)}
                                                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold transition-colors"
                                                    >
                                                        Set as Current
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Add Academic Year Form */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Register New Academic Year</h3>
                                    <p className="text-xs text-slate-700 font-medium">Create a real academic session identifier</p>
                                </div>

                                <form onSubmit={handleCreateYear} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                                                Session Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 2026-27"
                                                value={newYearName}
                                                onChange={(e) => setNewYearName(e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={newYearStart}
                                                onChange={(e) => setNewYearStart(e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={newYearEnd}
                                                onChange={(e) => setNewYearEnd(e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={isCreatingYear}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
                                        >
                                            <Plus size={15} />
                                            <span>{isCreatingYear ? 'Adding...' : 'Create Academic Year'}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'promotion' && (
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Class Promotion & Retention Rules</h3>
                                <p className="text-xs text-slate-700 font-medium">Automated end-of-year promotion criteria into the next grade level</p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                                        Minimum Passing Percentage for Auto-Promotion (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="30"
                                        max="75"
                                        value={formData.autoPromoteThreshold}
                                        onChange={(e) => setFormData({ ...formData, autoPromoteThreshold: Number(e.target.value) })}
                                        className="w-48 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <p className="text-[11px] text-slate-600 font-semibold mt-1">
                                        Students achieving this threshold or higher will be eligible for batch promotion to the next class.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-800 space-y-1">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <AlertCircle size={15} />
                                        <span>Promotion Locking Notice</span>
                                    </div>
                                    <p>
                                        End-of-term batch promotion requires final examination marks publishing and fee clearance verification.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={handleSaveSettings}
                                    disabled={isUpdating}
                                    className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
                                >
                                    <Save size={15} />
                                    <span>{isUpdating ? 'Saving...' : 'Save Promotion Rules'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
