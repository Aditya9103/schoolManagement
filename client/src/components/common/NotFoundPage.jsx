import React from 'react';
import { Link } from 'react-router-dom';
export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-8 text-center">
            <p className="text-8xl font-extrabold text-blue-700 font-bold font-display">404</p>
            <h1 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h1>
            <p className="text-slate-600 font-medium text-sm mb-8">The page you're looking for doesn't exist.</p>
            <Link to="/" className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm">Go Home</Link>
        </div>
    );
}
