import React, { useState } from 'react';
import { X, Layers, Plus, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCreateFeeStructureMutation, useGetFeeCategoriesQuery } from '../../../../../store/api/feeApi';
import { useGetClassesQuery } from '../../../../../store/api/classApi';

export default function CreateFeeStructureModal({ isOpen, onClose }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [academicYear, setAcademicYear] = useState('2026-27');
    const [selectedClassIds, setSelectedClassIds] = useState([]);
    const [components, setComponents] = useState([
        { categoryId: '', name: 'Tuition Fee (Quarterly)', amount: 15000, frequency: 'QUARTERLY' },
        { categoryId: '', name: 'Computer & Lab Fee', amount: 2500, frequency: 'QUARTERLY' },
    ]);
    const [errorMsg, setErrorMsg] = useState('');

    const { data: categoriesRes } = useGetFeeCategoriesQuery(undefined, { skip: !isOpen });
    const { data: classesRes } = useGetClassesQuery(undefined, { skip: !isOpen });

    const [createFeeStructure, { isLoading }] = useCreateFeeStructureMutation();

    const categories = categoriesRes?.data || [];
    const classes = classesRes?.data?.classes || classesRes?.data || [];

    const handleToggleClass = (classId) => {
        if (selectedClassIds.includes(classId)) {
            setSelectedClassIds(selectedClassIds.filter((id) => id !== classId));
        } else {
            setSelectedClassIds([...selectedClassIds, classId]);
        }
    };

    const handleSelectAllClasses = () => {
        if (selectedClassIds.length === classes.length) {
            setSelectedClassIds([]);
        } else {
            setSelectedClassIds(classes.map((c) => c._id));
        }
    };

    const handleAddComponent = () => {
        setComponents([
            ...components,
            { categoryId: categories[0]?._id || '', name: '', amount: 1000, frequency: 'QUARTERLY' },
        ]);
    };

    const handleRemoveComponent = (idx) => {
        if (components.length <= 1) return;
        setComponents(components.filter((_, i) => i !== idx));
    };

    const handleComponentChange = (idx, field, val) => {
        const next = [...components];
        next[idx][field] = val;
        setComponents(next);
    };

    const totalAmount = components.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!name.trim()) {
            setErrorMsg('Structure name is required');
            return;
        }

        if (selectedClassIds.length === 0) {
            setErrorMsg('Select at least one applicable class grade');
            return;
        }

        for (const c of components) {
            if (!c.name.trim()) {
                setErrorMsg('All fee components must have a title');
                return;
            }
            if (!c.amount || Number(c.amount) <= 0) {
                setErrorMsg('Component amounts must be greater than zero');
                return;
            }
        }

        try {
            await createFeeStructure({
                name: name.trim(),
                description: description.trim(),
                academicYear,
                classIds: selectedClassIds,
                components: components.map((c) => ({
                    categoryId: c.categoryId || categories[0]?._id,
                    name: c.name.trim(),
                    amount: Number(c.amount),
                    frequency: c.frequency,
                })),
            }).unwrap();

            onClose();
        } catch (err) {
            setErrorMsg(err.data?.message || err.message || 'Failed to create fee structure');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">Configure New Fee Structure</h2>
                            <p className="text-xs text-blue-100">Establish standard grade-wise fee heads & billing frequency</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                            <AlertCircle size={15} />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Structure Title *</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Primary Wing 2026-27 Standard Fee"
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                            <input
                                type="text"
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-hidden"
                            />
                        </div>
                    </div>

                    {/* Applicable Classes */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-700">Applicable Classes *</label>
                            <button
                                type="button"
                                onClick={handleSelectAllClasses}
                                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                            >
                                {selectedClassIds.length === classes.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 rounded-xl bg-slate-50 border border-slate-200">
                            {classes.map((cls) => {
                                const isSelected = selectedClassIds.includes(cls._id);
                                return (
                                    <button
                                        key={cls._id}
                                        type="button"
                                        onClick={() => handleToggleClass(cls._id)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        {cls.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Components Line Items */}
                    <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700">Fee Component Breakdown</label>
                            <button
                                type="button"
                                onClick={handleAddComponent}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>Add Component</span>
                            </button>
                        </div>

                        <div className="space-y-2.5">
                            {components.map((comp, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Component Title (e.g. Tuition)"
                                        value={comp.name}
                                        onChange={(e) => handleComponentChange(idx, 'name', e.target.value)}
                                        className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                                    />
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        placeholder="Amount"
                                        value={comp.amount}
                                        onChange={(e) => handleComponentChange(idx, 'amount', e.target.value)}
                                        className="w-24 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                                    />
                                    <select
                                        value={comp.frequency}
                                        onChange={(e) => handleComponentChange(idx, 'frequency', e.target.value)}
                                        className="text-xs px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
                                    >
                                        <option value="MONTHLY">Monthly</option>
                                        <option value="QUARTERLY">Quarterly</option>
                                        <option value="HALF_YEARLY">Half Yearly</option>
                                        <option value="ANNUAL">Annual</option>
                                        <option value="ONE_TIME">One Time</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveComponent(idx)}
                                        disabled={components.length <= 1}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-30 cursor-pointer"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Total Strip */}
                        <div className="flex items-center justify-between p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs mt-2">
                            <span className="font-bold text-slate-700">Total Structure Amount:</span>
                            <span className="font-mono font-black text-blue-700 text-sm">
                                ₹ {totalAmount.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    <span>Creating Structure...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={15} />
                                    <span>Save & Apply Structure</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
