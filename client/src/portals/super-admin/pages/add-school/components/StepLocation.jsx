import React from 'react';

const ADDR_FIELDS = [
    { label: 'Address Line 1', key: 'line1', placeholder: 'Street address, Building name' },
    { label: 'City *', key: 'city', placeholder: 'City name' },
    { label: 'State *', key: 'state', placeholder: 'State name' },
    { label: 'Pincode', key: 'pincode', placeholder: '110001', type: 'number' },
];

export default function StepLocation({ form, onAddressChange }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800">School Location</h2>
            {ADDR_FIELDS.map(({ label, key, placeholder, type = 'text' }) => (
                <div key={key} className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-800 font-bold font-extrabold uppercase tracking-wider">{label}</label>
                    <input type={type} value={form.address?.[key] || ''} onChange={(e) => onAddressChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                </div>
            ))}
        </div>
    );
}
