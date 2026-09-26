import React from 'react';
import { Clock, CheckCircle2, FileText, Calendar, CreditCard, UserPlus } from 'lucide-react';

export default function ApplicationTimelineWidget({ application = {} }) {
    const {
        createdAt,
        status,
        fees = {},
        entranceTest = {},
        documents = []
    } = application;

    const formattedCreatedDate = createdAt
        ? new Date(createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '23 Sep 2026, 10:24 AM';

    const events = [
        {
            id: 1,
            title: 'Application Submitted',
            desc: 'Online registration submitted by parent',
            date: formattedCreatedDate,
            icon: FileText,
            color: 'text-blue-600 bg-blue-50 border-blue-200'
        },
        {
            id: 2,
            title: 'Registration Fee Paid',
            desc: `₹${fees?.amount || '1,000'} received via online gateway (${fees?.transactionId || 'TXN1234567890'})`,
            date: formattedCreatedDate,
            icon: CreditCard,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
        },
        {
            id: 3,
            title: 'Documents Uploaded',
            desc: `${documents.length || 4} certificates & documents uploaded`,
            date: formattedCreatedDate,
            icon: CheckCircle2,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
        },
        ...(entranceTest?.testDate
            ? [
                  {
                      id: 4,
                      title: 'Entrance Test Scheduled',
                      desc: `Written test booked for ${new Date(entranceTest.testDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at ${entranceTest.venue || 'Hall B'}`,
                      date: '24 Sep 2026, 04:15 PM',
                      icon: Calendar,
                      color: 'text-purple-600 bg-purple-50 border-purple-200'
                  }
              ]
            : []),
        ...(status === 'ENROLLED'
            ? [
                  {
                      id: 5,
                      title: 'Student Enrolled',
                      desc: 'Student profile created and class section allocated',
                      date: 'Just now',
                      icon: UserPlus,
                      color: 'text-emerald-600 bg-emerald-100 border-emerald-300'
                  }
              ]
            : [])
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 transition-all space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Clock size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Application Timeline
                    </h3>
                </div>
                <span className="text-[11px] font-bold text-blue-600 cursor-pointer hover:underline">
                    View All
                </span>
            </div>

            <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {events.map((ev) => {
                    const Icon = ev.icon;
                    return (
                        <div key={ev.id} className="relative group">
                            {/* Dot / Icon */}
                            <div
                                className={`absolute -left-5 top-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center ${ev.color}`}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            </div>

                            <div className="text-xs">
                                <span className="font-bold text-slate-900 block leading-tight">
                                    {ev.title}
                                </span>
                                <span className="text-[11px] text-slate-700 font-semibold mt-0.5 block">
                                    {ev.desc}
                                </span>
                                <span className="text-[10px] text-slate-600 font-semibold font-medium mt-1 block">
                                    {ev.date}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
