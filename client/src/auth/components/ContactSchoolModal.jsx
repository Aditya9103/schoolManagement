import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, HelpCircle } from 'lucide-react';

/**
 * ContactSchoolModal.jsx — Modal displaying school support helpline & contact details.
 */
export default function ContactSchoolModal({ isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 relative overflow-hidden"
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full text-slate-600 font-medium hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                <HelpCircle size={22} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Contact School Administration</h3>
                                <p className="text-xs text-slate-700 font-medium">Need help logging into your PrimeSchoolOs account?</p>
                            </div>
                        </div>

                        <div className="space-y-3 my-4">
                            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                <Phone size={18} className="text-blue-600 mt-0.5" />
                                <div>
                                    <div className="text-xs font-semibold text-slate-700">School Helpline & Front Office</div>
                                    <div className="text-sm font-bold text-slate-900 mt-0.5">+91 1800 123 4567 / +91 98765 43210</div>
                                    <div className="text-[11px] text-slate-700 font-semibold mt-0.5">Mon – Sat, 8:00 AM – 4:00 PM IST</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                <Mail size={18} className="text-blue-600 mt-0.5" />
                                <div>
                                    <div className="text-xs font-semibold text-slate-700">Support Email</div>
                                    <div className="text-sm font-bold text-blue-600 mt-0.5">support@primeschoolos.com</div>
                                    <div className="text-[11px] text-slate-700 font-semibold mt-0.5">Responses within 2 business hours</div>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-800 leading-relaxed">
                                <span className="font-bold">New Student or Parent?</span> Your login credentials and mobile activation link are issued directly by your school admissions desk.
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
                        >
                            Got It
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
