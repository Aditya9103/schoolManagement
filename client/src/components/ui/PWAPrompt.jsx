import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAPrompt() {
    const [prompt, setPrompt] = useState(null);
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setPrompt(e); setShown(true); };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);
    const install = () => { prompt?.prompt(); setShown(false); };
    return (
        <AnimatePresence>
            {shown && (
                <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                    className="fixed bottom-24 left-0 right-0 mx-auto max-w-sm px-4 z-50">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">🎓</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white">Install PrimeSchoolOs</p>
                            <p className="text-[10px] text-slate-600 font-semibold">Add to Home Screen for the best experience</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={install} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold">
                                <Download size={11} /> Install
                            </button>
                            <button onClick={() => setShown(false)} className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300">
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
