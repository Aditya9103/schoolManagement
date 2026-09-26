import React, { useState, useEffect } from 'react';
import { X, Copy } from 'lucide-react';

export default function CopyRoleModal({ isOpen, onClose, onCopyRole, sourceRole, isCopying }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (sourceRole) {
            setName(`${sourceRole.name} (Copy)`);
            setError('');
        }
    }, [sourceRole]);

    if (!isOpen || !sourceRole) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('New role name is required');
            return;
        }
        setError('');
        onCopyRole({
            id: sourceRole._id,
            name: name.trim(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Copy size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 font-display">
                                Clone Existing Role
                            </h3>
                            <p className="text-[11px] text-slate-700 font-semibold">
                                Clones all permission matrix checkboxes from <span className="font-bold text-slate-700">{sourceRole.name}</span>
                            </p>
                        </div>
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
                            New Role Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                        />
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
                            disabled={isCopying}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                        >
                            {isCopying ? (
                                <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Copy size={14} />
                            )}
                            Duplicate Role
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
