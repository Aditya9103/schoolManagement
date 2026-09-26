import React from 'react';

const CLASSES = ['Class 8-A', 'Class 9-B', 'Class 10-A', 'Class 7-C'];

export default function ClassSelector({ selected, onSelect }) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {CLASSES.map((cls) => (
                <button key={cls} onClick={() => onSelect(cls)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selected === cls ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                    }`}>
                    {cls}
                </button>
            ))}
        </div>
    );
}
