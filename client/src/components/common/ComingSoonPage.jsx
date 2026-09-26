import React from 'react';
import { Rocket, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ComingSoonPage({ module = '' }) {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 border border-blue-100 mb-6">
                <Rocket size={36} className="text-blue-700 font-bold" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">Coming Soon</h2>
            <p className="text-slate-500 mt-2 max-w-xs text-sm">{module ? `The ${module} module` : 'This section'} is under development and will be available in the next phase.</p>
            <button onClick={() => navigate(-1)} className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/25">
                <ArrowLeft size={15} /> Go Back
            </button>
        </div>
    );
}
