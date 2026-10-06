import React, { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

export default function ChildSwitcher({ childrenList, activeIndex, onSelectChild }) {
    const [open, setOpen] = useState(false);
    const activeChild = childrenList[activeIndex] || childrenList[0];

    if (!activeChild) return null;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-750 text-white cursor-pointer transition-all shadow-xs"
            >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                    {activeChild.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold leading-tight">{activeChild.name}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">{activeChild.class}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 ml-1" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    <p className="text-[10px] font-extrabold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                        Select Child
                    </p>
                    {childrenList.map((child, idx) => (
                        <button
                            key={child.id}
                            type="button"
                            onClick={() => {
                                onSelectChild(idx);
                                setOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left cursor-pointer transition-colors ${
                                idx === activeIndex ? 'bg-blue-600/20 text-blue-300 font-bold' : 'hover:bg-slate-700/60 text-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                                    {child.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-bold">{child.name}</p>
                                    <p className="text-[10px] text-slate-400">{child.class} • Roll {child.rollNo}</p>
                                </div>
                            </div>
                            {idx === activeIndex && <CheckCircle2 size={16} className="text-blue-400" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
