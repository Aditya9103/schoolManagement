import React from 'react';
import { Star, Zap, Crown } from 'lucide-react';
import PlanCard from './components/PlanCard';

const PLANS = [
    { name: 'Basic', price: 999, Icon: Star, color: 'from-slate-500 to-slate-700', schools: 54, features: ['Up to 500 students', '5 core modules', 'Email support', 'Mobile PWA', 'Basic reports'] },
    { name: 'Pro', price: 2499, Icon: Zap, color: 'from-blue-600 to-violet-600', schools: 74, features: ['Up to 2000 students', '12 modules', 'Priority support', 'Custom domain', 'Advanced analytics', 'WhatsApp OTP'], badge: '⭐ Most Popular' },
    { name: 'Enterprise', price: 5999, Icon: Crown, color: 'from-amber-500 to-orange-600', schools: 28, features: ['Unlimited students', 'All 40+ modules', 'Dedicated support', 'White-label', 'Multi-branch', 'Custom integrations', 'SLA guarantee'] },
];

export default function SubscriptionPlansPage() {
    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 font-display">Subscription Plans</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage PrimeSchoolOs pricing tiers and school allocations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PLANS.map((plan) => <PlanCard key={plan.name} {...plan} />)}
            </div>
        </div>
    );
}
