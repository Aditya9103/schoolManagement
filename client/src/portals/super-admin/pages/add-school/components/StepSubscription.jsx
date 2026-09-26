import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

const PLANS = [
    { id: 'BASIC', label: 'Basic', icon: Star, price: '₹999/mo', color: 'from-slate-500 to-slate-600', features: ['Up to 500 students', '5 core modules', 'Email support', 'Mobile PWA'] },
    { id: 'PRO', label: 'Pro', icon: Zap, price: '₹2,499/mo', color: 'from-blue-600 to-violet-600', features: ['Up to 2000 students', '12 modules', 'Priority support', 'Custom domain', 'WhatsApp OTP'], badge: 'Most Popular' },
    { id: 'ENTERPRISE', label: 'Enterprise', icon: Crown, price: '₹5,999/mo', color: 'from-amber-500 to-orange-600', features: ['Unlimited students', 'All 40+ modules', 'Dedicated support', 'White-label', 'Multi-branch'] },
];

export default function StepSubscription({ selectedPlan, onSelect }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-5">Choose Subscription Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map(({ id, label, icon: Icon, price, color, features, badge }) => (
                    <div key={id} onClick={() => onSelect(id)}
                        className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                            selectedPlan === id ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-500/10 scale-[1.01]' : 'border-slate-200 hover:border-slate-300'
                        }`}>
                        {badge && <span className="absolute -top-2.5 left-4 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">{badge}</span>}
                        {selectedPlan === id && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                <Check size={12} className="text-white" />
                            </div>
                        )}
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color}mb-3 shadow-md`}>
                            <Icon size={18} className="text-white" />
                        </div>
                        <p className="font-extrabold text-slate-900">{label}</p>
                        <p className="text-xl font-extrabold text-blue-600 mt-1 font-display">{price}</p>
                        <ul className="mt-3 space-y-1.5">
                            {features.map((f) => (
                                <li key={f} className="text-xs text-slate-600 flex items-center gap-1.5">
                                    <Check size={11} className="text-emerald-700 font-bold flex-shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
