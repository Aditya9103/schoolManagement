import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

export default function PermissionRoute({ featureId, action = 'view', children }) {
    const { canAccess, hasAction, isAdmin, isLoading } = usePermissions();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    const hasAccess = isAdmin || (canAccess(featureId) && (action === 'view' || hasAction(featureId, action)));

    if (!hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 font-bold shadow-md mb-4">
                    <ShieldAlert size={32} />
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight font-display mb-2">
                    Access Denied
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-md mb-6 leading-relaxed">
                    You do not have permission to view or manage this section. Access has been restricted by your School Administrator.
                </p>
                <button
                    onClick={() => navigate('/school')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                    <ArrowLeft size={14} /> Back to Dashboard
                </button>
            </div>
        );
    }

    return children;
}
