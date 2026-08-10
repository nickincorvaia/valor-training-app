// User preference storage. Lives outside the component tree so both the
// Settings screen and the workout builder read the same defaults.

import { useState } from 'react';

const PREFS_KEY = 'valor_prefs';

export const DEFAULT_PREFS = {
    location: null,
    goal: null,
    level: null,
    duration: 45,
    favoriteBodyParts: [],
    restTimerSeconds: 90,
    soundEnabled: true,
    weightUnit: 'lb',
};

export function loadPrefs() {
    try {
        const stored = localStorage.getItem(PREFS_KEY);
        if (stored) return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
    } catch {
        /* corrupt payload — fall back to defaults */
    }
    return { ...DEFAULT_PREFS };
}

export function savePrefs(prefs) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    // Keep the timer's standalone sound flag in sync.
    localStorage.setItem('valor_sound', String(prefs.soundEnabled));
}

export function usePreferences() {
    const [prefs, setPrefs] = useState(loadPrefs);

    const updatePrefs = (updates) => {
        setPrefs(prev => {
            const next = { ...prev, ...updates };
            savePrefs(next);
            return next;
        });
    };

    return [prefs, updatePrefs];
}
