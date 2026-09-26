import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineBanner() {
    const [offline, setOffline] = useState(!navigator.onLine);
    useEffect(() => {
        const on = () => setOffline(false);
        const off = () => setOffline(true);
        window.addEventListener('online', on);
        window.addEventListener('offline', off);
        return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
    }, []);
    return (
        <AnimatePresence>
            {offline && (
                <motion.div initial={{ y: -40 }} animate={{ y: 0 }} exit={{ y: -40 }}
                    className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 bg-red-600 py-2 text-white text-xs font-semibold">
                    <WifiOff size={13} /> You're offline. Some features may be unavailable.
                </motion.div>
            )}
        </AnimatePresence>
    );
}
