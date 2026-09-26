import React from 'react';
import { MapPin, Edit3 } from 'lucide-react';

export default function AddressInfoCard({ address = {}, onEdit }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 transition-all">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 font-bold flex items-center justify-center">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-900">Address Information</h2>
                        <p className="text-[11px] text-slate-600 font-semibold">Official residential and correspondence location</p>
                    </div>
                </div>
                {onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                        <Edit3 size={13} />
                        Edit
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6">
                <div className="col-span-2 sm:col-span-4">
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Street Address</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                        {address.street || 'Flat 402, Royal Palms Apartments, Sector 14'}
                    </span>
                </div>

                <div>
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">City</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                        {address.city || 'Gurugram'}
                    </span>
                </div>

                <div>
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">State</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                        {address.state || 'Haryana'}
                    </span>
                </div>

                <div>
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">PIN Code</span>
                    <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">
                        {address.pincode || '122001'}
                    </span>
                </div>

                <div>
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Country</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                        {address.country || 'India'}
                    </span>
                </div>
            </div>
        </div>
    );
}
