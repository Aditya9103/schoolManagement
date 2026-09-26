import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6 relative">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-100">
                <Link
                    to="/auth/login"
                    className="inline-flex items-center gap-2 text-slate-700 font-medium hover:text-slate-800 text-xs font-semibold mb-6 transition-colors"
                >
                    <ArrowLeft size={15} /> Back to Sign In
                </Link>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5">
                    <Mail size={24} />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    Reset Password
                </h1>
                <p className="text-slate-700 font-medium text-xs sm:text-sm mb-6">
                    Enter your registered email address or mobile number and we'll send you a password reset verification link.
                </p>

                {submitted ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs leading-relaxed">
                        If an account exists for <span className="font-semibold">{email}</span>, you will receive password reset instructions shortly.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600 font-medium">
                                <Mail size={16} />
                            </div>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                required
                                placeholder="Email or Mobile Number"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-500 font-medium outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
                        >
                            Send Reset Instructions
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
