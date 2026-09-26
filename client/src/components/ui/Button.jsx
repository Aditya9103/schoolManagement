import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable high-visibility Button component.
 * Synced heights (44px / h-11 default), crisp contrast, and tactile feedback.
 */
export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    onClick,
    ...props
}) {
    const variantStyles = {
        primary:
            'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white border border-blue-700 shadow-sm shadow-blue-600/20 focus:ring-blue-600',
        secondary:
            'bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 border border-slate-300 hover:border-slate-400 shadow-2xs focus:ring-slate-400',
        success:
            'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white border border-emerald-700 shadow-sm shadow-emerald-600/20 focus:ring-emerald-600',
        danger:
            'bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white border border-rose-700 shadow-sm shadow-rose-600/20 focus:ring-rose-600',
        outline:
            'bg-transparent hover:bg-blue-50/70 active:scale-[0.98] text-blue-700 border border-blue-600 focus:ring-blue-600',
        ghost:
            'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-transparent focus:ring-slate-400',
    };

    const sizeStyles = {
        sm: 'h-9 px-3.5 text-xs font-bold rounded-lg gap-1.5',
        md: 'h-11 px-5 text-sm font-bold rounded-xl gap-2',
        lg: 'h-12 px-6 text-base font-bold rounded-xl gap-2.5',
    };

    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            disabled={isDisabled}
            onClick={onClick}
            className={`inline-flex items-center justify-center font-bold tracking-tight outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none ${
                variantStyles[variant] || variantStyles.primary
            } ${sizeStyles[size] || sizeStyles.md} ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2.2} />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2.2} />}
                </>
            )}
        </button>
    );
}
