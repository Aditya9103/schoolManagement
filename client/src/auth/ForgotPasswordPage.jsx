import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Loader2,
    KeyRound,
    Check,
    RefreshCw,
    ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    useSendForgotPasswordOtpMutation,
    useResetPasswordMutation,
} from '../store/api/authApi';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    // Step state: 1 = Enter Email, 2 = Enter OTP & New Password, 3 = Success
    const [step, setStep] = useState(1);

    // Form inputs
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI state
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);

    // API Mutations
    const [sendForgotPasswordOtp, { isLoading: isSendingOtp }] = useSendForgotPasswordOtpMutation();
    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

    // Resend countdown timer
    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Password validation rules
    const hasMinLength = newPassword.length >= 8 && newPassword.length <= 20;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
    const isPasswordStrong = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

    // Step 1: Send OTP
    const handleSendResetCode = async (e) => {
        e?.preventDefault();
        setErrorMsg(null);

        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail) {
            setErrorMsg('Please enter your registered email address.');
            return;
        }

        try {
            const res = await sendForgotPasswordOtp({
                email: cleanEmail,
                identifier: cleanEmail,
                channel: 'email',
            }).unwrap();

            toast.success(res?.message || 'Verification code sent to your email!');
            setStep(2);
            setResendCooldown(60);
        } catch (err) {
            const msg =
                err?.data?.message ||
                err?.message ||
                'Unable to send reset code. Please check your email and try again.';
            setErrorMsg(msg);
            toast.error(msg);
        }
    };

    // Step 2: Resend OTP
    const handleResendCode = async () => {
        if (resendCooldown > 0 || isSendingOtp) return;
        setErrorMsg(null);

        try {
            const cleanEmail = email.trim().toLowerCase();
            const res = await sendForgotPasswordOtp({
                email: cleanEmail,
                identifier: cleanEmail,
                channel: 'email',
            }).unwrap();

            toast.success(res?.message || 'New verification code sent!');
            setResendCooldown(60);
        } catch (err) {
            const msg = err?.data?.message || err?.message || 'Failed to resend code. Please try again.';
            setErrorMsg(msg);
            toast.error(msg);
        }
    };

    // Step 2: Submit Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        const cleanOtp = otp.trim();
        if (!cleanOtp || cleanOtp.length !== 6) {
            setErrorMsg('Please enter the 6-digit verification code.');
            return;
        }

        if (!isPasswordStrong) {
            setErrorMsg('Please make sure your new password meets all security requirements.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match. Please verify your password confirmation.');
            return;
        }

        try {
            const res = await resetPassword({
                email: email.trim().toLowerCase(),
                otp: cleanOtp,
                newPassword,
                confirmPassword,
            }).unwrap();

            toast.success(res?.message || 'Password reset successfully!');
            setStep(3);
        } catch (err) {
            const msg =
                err?.data?.message ||
                err?.message ||
                'Failed to reset password. Please check your verification code and try again.';
            setErrorMsg(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative">
            {/* Subtle background decoration */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />

            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/80 relative z-10">
                {/* Back to sign in (Steps 1 & 2) */}
                {step !== 3 && (
                    <Link
                        to="/auth/login"
                        className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 text-xs font-bold mb-6 transition-colors"
                    >
                        <ArrowLeft size={15} /> Back to Sign In
                    </Link>
                )}

                {/* Error Banner */}
                {errorMsg && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
                        <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{errorMsg}</span>
                    </div>
                )}

                {/* ── STEP 1: Enter Email ────────────────────────────────────── */}
                {step === 1 && (
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5 shadow-xs">
                            <KeyRound size={24} />
                        </div>

                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                            Reset Password
                        </h1>
                        <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed mb-6">
                            Enter your registered email address and we'll send you a 6-digit verification code to reset your password.
                        </p>

                        <form onSubmit={handleSendResetCode} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                                    Registered Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        required
                                        autoFocus
                                        placeholder="admin@school.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-semibold placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-2xs"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSendingOtp}
                                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {isSendingOtp ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Sending Code...</span>
                                    </>
                                ) : (
                                    <span>Send Reset Instructions</span>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── STEP 2: Enter OTP & Set New Password ────────────────────── */}
                {step === 2 && (
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-5 shadow-xs">
                            <ShieldCheck size={24} />
                        </div>

                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1.5">
                            Verify & Set Password
                        </h1>
                        <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed mb-5">
                            Enter the 6-digit code sent to{' '}
                            <span className="font-bold text-slate-900">{email}</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setErrorMsg(null);
                                }}
                                className="text-blue-600 hover:text-blue-800 font-bold ml-1.5 underline cursor-pointer"
                            >
                                Change
                            </button>
                        </p>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            {/* OTP Field */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        6-Digit Verification Code
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={resendCooldown > 0 || isSendingOtp}
                                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-colors"
                                    >
                                        <RefreshCw size={11} className={isSendingOtp ? 'animate-spin' : ''} />
                                        <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}</span>
                                    </button>
                                </div>
                                <input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    required
                                    autoFocus
                                    placeholder="• • • • • •"
                                    className="w-full text-center py-3 px-4 rounded-xl border border-slate-200 bg-white text-lg font-mono font-bold tracking-widest text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-2xs"
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        type={showNewPassword ? 'text' : 'password'}
                                        required
                                        placeholder="Enter new strong password"
                                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-semibold placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-2xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-800 cursor-pointer"
                                    >
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {/* Password requirements checklist */}
                                {newPassword.length > 0 && (
                                    <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                            Password Requirements:
                                        </p>
                                        <div className="grid grid-cols-2 gap-1 text-[11px] font-medium">
                                            <span className={`inline-flex items-center gap-1 ${hasMinLength ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>
                                                <Check size={12} className={hasMinLength ? 'text-emerald-600' : 'text-slate-400'} />
                                                8–20 characters
                                            </span>
                                            <span className={`inline-flex items-center gap-1 ${hasUppercase ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>
                                                <Check size={12} className={hasUppercase ? 'text-emerald-600' : 'text-slate-400'} />
                                                1 uppercase letter
                                            </span>
                                            <span className={`inline-flex items-center gap-1 ${hasLowercase ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>
                                                <Check size={12} className={hasLowercase ? 'text-emerald-600' : 'text-slate-400'} />
                                                1 lowercase letter
                                            </span>
                                            <span className={`inline-flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>
                                                <Check size={12} className={hasNumber ? 'text-emerald-600' : 'text-slate-400'} />
                                                1 number (0–9)
                                            </span>
                                            <span className={`col-span-2 inline-flex items-center gap-1 ${hasSpecial ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>
                                                <Check size={12} className={hasSpecial ? 'text-emerald-600' : 'text-slate-400'} />
                                                1 special character (!@#$%^&*)
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        placeholder="Confirm new password"
                                        className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-white text-sm text-slate-900 font-semibold placeholder:text-slate-500 outline-none transition-all shadow-2xs ${
                                            confirmPassword && !passwordsMatch
                                                ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                                : confirmPassword && passwordsMatch
                                                ? 'border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                                : 'border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-800 cursor-pointer"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {confirmPassword && !passwordsMatch && (
                                    <p className="text-[11px] font-bold text-rose-600 mt-1">
                                        Passwords do not match
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isResetting || !passwordsMatch || !isPasswordStrong || otp.length !== 6}
                                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {isResetting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Resetting Password...</span>
                                    </>
                                ) : (
                                    <span>Reset Password</span>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── STEP 3: Success Screen ─────────────────────────────────── */}
                {step === 3 && (
                    <div className="text-center py-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 mb-5 shadow-xs border border-emerald-100">
                            <CheckCircle2 size={36} />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                            Password Reset Successfully!
                        </h2>
                        <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed mb-6">
                            Your password has been securely updated. You can now sign in to PrimeSchoolOs using your new credentials.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/auth/login')}
                            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                        >
                            Proceed to Sign In
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
