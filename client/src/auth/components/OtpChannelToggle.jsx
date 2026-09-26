/**
 * OtpChannelToggle.jsx — Toggle between Email OTP and WhatsApp OTP.
 */
import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';

export default function OtpChannelToggle({ channel, onChange }) {
    return (
        <div className="flex rounded-xl bg-slate-800/60 p-1 gap-1 border border-slate-700/50">
            {[
                { value: 'email', label: 'Email OTP', Icon: Mail },
                { value: 'whatsapp', label: 'WhatsApp OTP', Icon: MessageCircle },
            ].map(({ value, label, Icon }) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => onChange(value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        channel === value
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                            : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Icon size={13} />
                    {label}
                </button>
            ))}
        </div>
    );
}
