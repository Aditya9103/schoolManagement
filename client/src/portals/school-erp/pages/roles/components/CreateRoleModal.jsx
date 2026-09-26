import React, { useState } from 'react';
import { X, Plus, Shield } from 'lucide-react';

export default function CreateRoleModal({ isOpen, onClose, onCreateRole, isCreating }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('blue');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Role name is required');
            return;
        }
        setError('');
        onCreateRole({
            name: name.trim(),
            description: description.trim(),
            color,
            icon: 'Users',
            permissions: {},
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Shield size={18} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 font-display">
                            Create Custom Role
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-600 font-medium hover:text-slate-600 hover:bg-slate-100"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
                    {error && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                            Role Name *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Exam Coordinator, Lab Assistant"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Brief description of this role's responsibilities"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            Color Theme
                        </label>
                        <div className="flex items-center gap-2">
                            {['blue', 'emerald', 'purple', 'amber', 'rose', 'cyan', 'violet'].map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                        color === c ? 'scale-125 border-slate-800' : 'border-white'
                                    } ${
                                        c === 'blue' ? 'bg-blue-500' :
                                        c === 'emerald' ? 'bg-emerald-500' :
                                        c === 'purple' ? 'bg-purple-500' :
                                        c === 'amber' ? 'bg-amber-500' :
                                        c === 'rose' ? 'bg-rose-500' :
                                        c === 'cyan' ? 'bg-cyan-500' : 'bg-violet-500'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                        >
                            {isCreating ? (
                                <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Plus size={14} />
                            )}
                            Create Role
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
