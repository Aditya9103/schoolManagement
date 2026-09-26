/**
 * LoginPage.jsx — PrimeSchoolOs Unified Single Login Page.
 * Responsive, native-feeling mobile experience (< lg) seamlessly merging into
 * the dual-column desktop hero layout (>= lg) with a single form instance.
 */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    MessageCircle,
    ChevronDown,
    Check,
    Sparkles,
} from 'lucide-react';
import {
    useSendOtpMutation,
    useLoginWithOtpMutation,
    useLoginWithPasswordMutation,
} from '../store/api/authApi';
import { setCredentials, getPortalRoute } from '../store/slices/authSlice';
import LoginHero from './components/LoginHero';
import SocialAuthButtons from './components/SocialAuthButtons';
import EducationBeyondBoundaries from './components/EducationBeyondBoundaries';
import ContactSchoolModal from './components/ContactSchoolModal';
import OtpChannelToggle from './components/OtpChannelToggle';

export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
    const [otpChannel, setOtpChannel] = useState('email'); // 'email' | 'whatsapp'
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('psos_remember') === 'true');
    const [errorMsg, setErrorMsg] = useState(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [language, setLanguage] = useState('English');
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const invitedSchool = searchParams.get('invitedSchool');
    const invitedEmail = searchParams.get('email');

    const { isAuthenticated, user } = useSelector((s) => s.auth);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(getPortalRoute(user.role), { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    // API Mutations
    const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
    const [loginWithPassword, { isLoading: loggingWithPw }] = useLoginWithPasswordMutation();
    const [loginWithOtp, { isLoading: loggingWithOtp }] = useLoginWithOtpMutation();
    const loading = isSendingOtp || loggingWithPw || loggingWithOtp;

    const savedIdentifier = localStorage.getItem('psos_identifier') || '';
    const initialIdentifier = invitedEmail || savedIdentifier;
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            identifier: initialIdentifier,
            password: '',
            otp: '',
        },
    });

    useEffect(() => {
        if (invitedEmail) {
            setValue('identifier', invitedEmail);
        }
    }, [invitedEmail, setValue]);

    const emailVal = watch('identifier');

    const handleSendOtp = async () => {
        const cleanEmail = emailVal?.trim();
        if (!cleanEmail) {
            setErrorMsg('Please enter your email or mobile number first');
            return;
        }
        setErrorMsg(null);
        try {
            await sendOtp({ email: cleanEmail, purpose: 'LOGIN', channel: otpChannel }).unwrap();
            setOtpSent(true);
        } catch (err) {
            setErrorMsg(err?.data?.message || err?.data?.error || 'Failed to send OTP. Please try again.');
        }
    };

    const onSubmit = async (formData) => {
        setErrorMsg(null);
        const cleanIdentifier = formData.identifier?.trim() || '';
        const cleanOtp = formData.otp?.trim() || '';

        try {
            // Remember me persistence
            if (rememberMe) {
                localStorage.setItem('psos_remember', 'true');
                localStorage.setItem('psos_identifier', cleanIdentifier);
            } else {
                localStorage.removeItem('psos_remember');
                localStorage.removeItem('psos_identifier');
            }

            let data;
            if (loginMethod === 'password') {
                data = await loginWithPassword({
                    identifier: cleanIdentifier,
                    password: formData.password,
                }).unwrap();
            } else {
                data = await loginWithOtp({
                    email: cleanIdentifier,
                    otp: cleanOtp,
                }).unwrap();
            }

            const authData = data?.data || data;
            if (!authData?.user || !authData?.user?.role) {
                throw new Error('Authentication response is missing user profile');
            }

            dispatch(
                setCredentials({
                    user: authData.user,
                    accessToken: authData.accessToken,
                    refreshToken: authData.refreshToken,
                })
            );
            navigate(getPortalRoute(authData.user.role), { replace: true });
        } catch (err) {
            setErrorMsg(err?.data?.message || err?.data?.error || err?.message || 'Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-between relative overflow-x-hidden selection:bg-blue-600 selection:text-white bg-white">
            {/* Desktop Campus Backdrop Layers (>= lg) */}
            <div
                className="hidden lg:block fixed inset-x-0 top-16 -bottom-20 pointer-events-none bg-cover bg-no-repeat z-0"
                style={{
                    backgroundImage: "url('/authSchoolbg.png')",
                    backgroundPosition: 'left bottom',
                }}
            />
            <div className="hidden lg:block fixed inset-x-0 top-0 h-[52%] pointer-events-none z-0 bg-white" />
            <div className="hidden lg:block fixed inset-x-0 top-[51%] h-20 pointer-events-none z-0 bg-gradient-to-b from-white via-white/80 to-transparent" />
            <div className="hidden lg:block fixed inset-y-0 right-0 w-[48%] pointer-events-none z-0 bg-gradient-to-l from-white via-white/95 to-transparent" />
            <div className="hidden lg:block fixed left-0 bottom-0 w-[55%] h-32 pointer-events-none z-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />

            {/* Mobile Native Waves Backdrop (< lg) */}
            <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden z-0">
                <svg
                    className="absolute -top-4 -left-6 w-[130%] h-60 pointer-events-none"
                    viewBox="0 0 500 240"
                    fill="none"
                >
                    <defs>
                        <linearGradient id="mobWaveTop" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.45" />
                            <stop offset="60%" stopColor="#dbeafe" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#eff6ff" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M-20,0 L500,0 L500,50 C410,110 330,60 230,120 C130,180 50,150 -20,200 Z"
                        fill="url(#mobWaveTop)"
                    />
                </svg>
                <svg
                    className="absolute bottom-0 left-0 w-full h-44 pointer-events-none"
                    viewBox="0 0 400 180"
                    fill="none"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="mobWaveBot" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#eff6ff" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.55" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0,105 C80,65 180,120 280,75 C330,50 370,60 400,70 L400,180 L0,180 Z"
                        fill="url(#mobWaveBot)"
                    />
                </svg>
            </div>

            {/* Main Flex Layout: Split-screen on desktop, Native centered card on mobile */}
            <div className="relative z-10 flex-1 flex flex-col lg:flex-row w-full max-w-[1550px] mx-auto min-h-screen lg:h-screen lg:max-h-screen overflow-y-auto lg:overflow-hidden">
                {/* ── Left Column: Desktop Hero Branding (hidden on mobile) ─────────── */}
                <div className="hidden lg:flex w-[55%] xl:w-[57%] flex-shrink-0 flex-col h-full overflow-hidden">
                    <LoginHero />
                </div>

                {/* ── Right Column: Login Card & Form (Unified for Mobile & Desktop) ─ */}
                <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:py-5 lg:px-6 xl:px-10 w-full max-w-md sm:max-w-lg lg:max-w-none mx-auto min-h-screen lg:min-h-0 lg:h-full relative">
                    {/* Top Navigation Row */}
                    <div className="flex items-center justify-between w-full pt-1 pb-1 shrink-0">
                        {/* Mobile Brand Logo */}
                        <div className="lg:hidden flex items-center">
                            <img
                                src="/logowithoutbg.png"
                                alt="PrimeSchoolOs Logo"
                                className="h-10 sm:h-12 w-auto object-contain"
                            />
                        </div>

                        {/* Top-Right Controls */}
                        <div className="flex items-center gap-3 ml-auto">
                            {/* Language Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setLangDropdownOpen((v) => !v)}
                                    className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors py-1 px-1.5 rounded-lg hover:bg-slate-100/70"
                                >
                                    <span>{language}</span>
                                    <ChevronDown size={14} className="text-slate-500" />
                                </button>
                                {langDropdownOpen && (
                                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                                        {['English', 'हिन्दी'].map((lang) => (
                                            <button
                                                key={lang}
                                                type="button"
                                                onClick={() => {
                                                    setLanguage(lang);
                                                    setLangDropdownOpen(false);
                                                }}
                                                className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                                            >
                                                {lang}
                                                {language === lang && <Check size={12} className="text-blue-600" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Contact School (Desktop) */}
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
                                <span>Don't have an account?</span>
                                <button
                                    type="button"
                                    onClick={() => setIsContactModalOpen(true)}
                                    className="font-semibold text-[#1a73e8] hover:underline transition-colors"
                                >
                                    Contact School
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Centered Login Card & Script */}
                    <div className="flex-1 flex flex-col items-center justify-center my-auto py-2 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-[390px] xl:max-w-[410px] bg-white rounded-3xl p-6 sm:p-7 shadow-[0_20px_45px_rgba(15,23,42,0.06)] border border-slate-100/90 relative"
                        >
                            {/* Card Header */}
                            {invitedSchool ? (
                                <div className="text-left mb-4">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider mb-2">
                                        <Sparkles size={12} className="text-blue-600" />
                                        Administrator Account Activation
                                    </div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
                                        {invitedSchool}
                                    </h1>
                                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                                        Your administrator portal is ready. Log in below with your credentials to activate your account.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-left mb-4">
                                    <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight font-display">
                                        Welcome Back
                                    </h1>
                                    <p className="text-xs text-slate-700 font-medium mt-1">
                                        Sign in to your PrimeSchoolOs account
                                    </p>
                                </div>
                            )}

                            {/* Activation Helper Banner */}
                            {invitedSchool && (
                                <div className="mb-3.5 p-3 rounded-2xl bg-blue-50/80 border border-blue-200/90 text-left text-xs space-y-2">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="font-bold text-blue-900">Initial Password:</span>
                                        <div className="flex items-center gap-1.5">
                                            <code className="font-mono font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                                                Password@123
                                            </code>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setLoginMethod('password');
                                                    setValue('password', 'Password@123');
                                                    setShowPassword(true);
                                                }}
                                                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                                            >
                                                Auto-fill
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-blue-700/90 leading-tight">
                                        Click <strong>Auto-fill</strong> to use the initial password, or choose <strong>Login with OTP</strong> below to verify via email code.
                                    </p>
                                </div>
                            )}

                            {/* Single Unified Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                                {/* Error Alert */}
                                <AnimatePresence>
                                    {errorMsg && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            className="p-2.5 rounded-xl bg-red-50 border border-red-200/80 text-[11px] text-red-600 font-medium flex items-start gap-2"
                                        >
                                            <span className="text-red-500">⚠️</span>
                                            <span className="flex-1">{errorMsg}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Input 1: Email or Mobile Number */}
                                <div className="space-y-0.5">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600 font-medium">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            autoComplete="username"
                                            placeholder="Email or Mobile Number"
                                            {...register('identifier', { required: 'Email or Mobile Number is required' })}
                                            className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 bg-white transition-all outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 ${
                                                errors.identifier ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.identifier && (
                                        <p className="text-[10px] text-red-500 pl-1">{errors.identifier.message}</p>
                                    )}
                                </div>

                                {/* Password Flow */}
                                {loginMethod === 'password' && (
                                    <>
                                        {/* Input 2: Password */}
                                        <div className="space-y-0.5">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600 font-medium">
                                                    <Lock size={16} />
                                                </div>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    autoComplete="current-password"
                                                    placeholder="Password"
                                                    {...register('password', { required: 'Password is required' })}
                                                    className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 bg-white transition-all outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 ${
                                                        errors.password ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((v) => !v)}
                                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-600 font-medium hover:text-slate-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="text-[10px] text-red-500 pl-1">{errors.password.message}</p>
                                            )}
                                        </div>

                                        {/* Remember Me & Forgot Password */}
                                        <div className="flex items-center justify-between text-xs pt-0.5">
                                            <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-800 font-bold hover:text-slate-800 font-medium">
                                                <input
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer accent-blue-600"
                                                />
                                                <span>Remember me</span>
                                            </label>

                                            <Link
                                                to="/auth/forgot-password"
                                                className="text-[#1a73e8] hover:underline font-medium transition-colors"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                    </>
                                )}

                                {/* OTP Flow */}
                                {loginMethod === 'otp' && (
                                    <div className="space-y-2 pt-0.5">
                                        <OtpChannelToggle channel={otpChannel} onChange={setOtpChannel} />

                                        {otpSent && (
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-semibold text-slate-700">Enter 6-Digit OTP</span>
                                                    <button
                                                        type="button"
                                                        onClick={handleSendOtp}
                                                        disabled={loading}
                                                        className="text-blue-600 hover:underline font-semibold"
                                                    >
                                                        Resend
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600 font-medium">
                                                        <Lock size={16} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={6}
                                                        placeholder="••••••"
                                                        {...register('otp', { required: 'OTP is required' })}
                                                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 tracking-widest font-semibold outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 text-center"
                                                    />
                                                </div>
                                                <p className="text-[11px] text-slate-700 font-semibold text-center">
                                                    OTP sent to your {otpChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action Submit Button */}
                                <div className="pt-1">
                                    {loginMethod === 'otp' && !otpSent ? (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={loading}
                                            className="w-full py-3 px-4 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                                        >
                                            {loading ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    {otpChannel === 'whatsapp' ? <MessageCircle size={16} /> : <Mail size={16} />}
                                                    <span>Send OTP via {otpChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}</span>
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 px-4 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                                        >
                                            {loading ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span>Sign In</span>
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="flex items-center my-3">
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="px-3 text-xs font-semibold text-slate-700 font-extrabold uppercase tracking-wider">
                                        OR
                                    </span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                </div>

                                {/* Social Login SSO */}
                                <SocialAuthButtons />

                                {/* Security Badge */}
                                <div className="mt-3 pt-1">
                                    <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#f0f7ff] border border-[#d0e5ff] text-[11px] font-medium text-slate-700">
                                        <ShieldCheck size={15} className="text-[#1a73e8] shrink-0" />
                                        <span>Secure &nbsp;•&nbsp; Reliable &nbsp;•&nbsp; Trusted by Schools</span>
                                    </div>
                                </div>

                                {/* Mode Switch */}
                                <div className="text-center pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLoginMethod((m) => (m === 'password' ? 'otp' : 'password'));
                                            setOtpSent(false);
                                            setErrorMsg(null);
                                        }}
                                        className="text-[11px] text-slate-600 font-semibold hover:text-[#1a73e8] transition-colors font-medium"
                                    >
                                        {loginMethod === 'password'
                                            ? 'Sign in with OTP instead'
                                            : '← Sign in with Password instead'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>

                        {/* Education Beyond Boundaries Script Accent */}
                        <div className="w-full max-w-[390px] xl:max-w-[410px] flex justify-end mt-3 pr-1">
                            <EducationBeyondBoundaries align="right" />
                        </div>

                        {/* Mobile Contact Link (shown on small screens below card) */}
                        <div className="sm:hidden flex items-center justify-center gap-1.5 text-xs text-slate-600 mt-4">
                            <span>Don't have an account?</span>
                            <button
                                type="button"
                                onClick={() => setIsContactModalOpen(true)}
                                className="font-semibold text-[#1a73e8] hover:underline transition-colors"
                            >
                                Contact School
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact School Administration Modal */}
            <ContactSchoolModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </div>
    );
}
