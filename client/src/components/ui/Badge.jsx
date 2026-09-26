import React from 'react';

/**
 * Reusable high-contrast Badge component for statuses, tags, and plans.
 */
export default function Badge({
    children,
    variant = 'default',
    size = 'sm',
    className = '',
}) {
    const variants = {
        default: 'bg-slate-100 text-slate-800 border-slate-300',
        active: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        success: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        warning: 'bg-amber-50 text-amber-900 border-amber-300',
        expiring: 'bg-amber-50 text-amber-900 border-amber-300',
        danger: 'bg-rose-50 text-rose-800 border-rose-300',
        inactive: 'bg-slate-100 text-slate-700 border-slate-300',
        info: 'bg-blue-50 text-blue-800 border-blue-300',
        primary: 'bg-blue-50 text-blue-800 border-blue-300',
        purple: 'bg-purple-50 text-purple-800 border-purple-300',
        premium: 'bg-purple-50 text-purple-800 border-purple-300',
        enterprise: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    };

    const sizes = {
        xs: 'px-2 py-0.5 text-[10px] font-bold rounded-md',
        sm: 'px-2.5 py-1 text-xs font-bold rounded-lg',
        md: 'px-3 py-1.5 text-xs font-extrabold rounded-lg',
    };

    return (
        <span
            className={`inline-flex items-center gap-1 border shadow-2xs leading-none uppercase tracking-wide select-none ${
                variants[variant] || variants.default
            } ${sizes[size] || sizes.sm} ${className}`}
        >
            {children}
        </span>
    );
}
