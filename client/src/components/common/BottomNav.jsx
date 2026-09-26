/**
 * BottomNav.jsx — Mobile bottom navigation bar.
 * Native iOS/Android tab bar feel.
 */
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BottomNav({ items, bgColor = 'bg-slate-900', borderColor = 'border-slate-800/80' }) {
    return (
        <nav className={`fixed bottom-0 left-0 right-0 max-w-sm mx-auto ${bgColor}border-t ${borderColor}backdrop-blur-xl z-50`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
            <div className="flex items-stretch justify-around px-2">
                {items.map(({ to, label, Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 py-3 px-3 flex-1 transition-all duration-200 ${
                                isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`relative flex items-center justify-center h-7 w-7 rounded-xl transition-all ${isActive ? 'bg-blue-500/20' : ''}`}>
                                    <Icon size={20} strokeWidth={isActive ? 2.2 : 1.7} />
                                    {isActive && <div className="absolute inset-0 rounded-xl bg-blue-400/10 blur-sm" />}
                                </div>
                                <span className={`text-[10px] font-semibold transition-all ${isActive ? 'text-blue-400' : 'text-slate-600'}`}>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
