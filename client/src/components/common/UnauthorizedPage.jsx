import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-8 text-center">
            <ShieldX size={60} className="text-red-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Unauthorized Access</h1>
            <p className="text-slate-600 font-medium text-sm mb-8">You don't have permission to view this page.</p>
            <Link to="/" className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm">Go Home</Link>
        </div>
    );
}
