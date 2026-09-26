/**
 * MobileShell.jsx — Shared mobile app wrapper.
 * Provides the native-feel phone layout: status bar safe area,
 * max-width centering, and bottom-nav-aware padding.
 */
import React from 'react';

export default function MobileShell({ children, bottomNav = true, className = '' }) {
    return (
        <div className={`min-h-[100dvh] w-full max-w-sm mx-auto relative bg-slate-950 flex flex-col overflow-hidden ${className}`}>
            {/* Safe area top */}
            <div className="flex-shrink-0" style={{ height: 'env(safe-area-inset-top, 0px)' }} />
            {/* Content */}
            <div className={`flex-1 flex flex-col overflow-hidden ${bottomNav ? 'pb-24' : ''}`}>
                {children}
            </div>
            {/* Safe area bottom */}
            <div className="flex-shrink-0" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
        </div>
    );
}
