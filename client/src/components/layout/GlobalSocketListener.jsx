/**
 * GlobalSocketListener.jsx
 * Connects to Socket.IO for real-time events.
 * Phase 1: stub (active in Phase 6+).
 */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function GlobalSocketListener() {
    const { isAuthenticated, user } = useSelector((s) => s.auth);
    useEffect(() => {
        if (!isAuthenticated || !user) return;
        // Phase 6: Wire Socket.IO connection here
        return () => {};
    }, [isAuthenticated, user]);
    return null;
}
