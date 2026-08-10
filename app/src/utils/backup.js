// Backup and restore for workout history.
// localStorage is the only store this app has, and clearing the browser/WebView
// cache wipes it permanently — these helpers give the user a portable copy.

const HISTORY_KEY = 'vigor_history';
const PREFS_KEY = 'valor_prefs';
export const BACKUP_FORMAT = 'valor-training-backup';
export const BACKUP_VERSION = 1;

export function readHistory() {
    try {
        const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function writeHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function readPrefs() {
    try {
        return JSON.parse(localStorage.getItem(PREFS_KEY) || 'null');
    } catch {
        return null;
    }
}

/**
 * Builds the backup payload written to disk.
 */
export function buildBackup() {
    return {
        format: BACKUP_FORMAT,
        version: BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        history: readHistory(),
        preferences: readPrefs(),
    };
}

export function backupFilename(date = new Date()) {
    const stamp = date.toISOString().slice(0, 10);
    return `valor-training-backup-${stamp}.json`;
}

/**
 * A workout is only restorable if it carries the fields History renders.
 */
function isValidWorkout(w) {
    return (
        w &&
        typeof w === 'object' &&
        typeof w.id === 'string' &&
        Array.isArray(w.exercises) &&
        w.header &&
        Array.isArray(w.header.bodyParts) &&
        typeof w.createdAt === 'string'
    );
}

/**
 * Validates a parsed backup file. Returns { ok, workouts, error }.
 */
export function parseBackup(raw) {
    let data;
    try {
        data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
        return { ok: false, error: "That file isn't valid JSON." };
    }

    // Accept both a full backup object and a bare history array.
    const history = Array.isArray(data)
        ? data
        : Array.isArray(data?.history)
            ? data.history
            : null;

    if (!history) {
        return { ok: false, error: "No workout history found in that file." };
    }
    if (!Array.isArray(data) && data.format && data.format !== BACKUP_FORMAT) {
        return { ok: false, error: "That backup came from a different app." };
    }

    const workouts = history.filter(isValidWorkout);
    if (workouts.length === 0) {
        return { ok: false, error: "That file contains no readable workouts." };
    }

    return {
        ok: true,
        workouts,
        skipped: history.length - workouts.length,
        preferences: Array.isArray(data) ? null : data.preferences ?? null,
    };
}

/**
 * Merges imported workouts into existing history, newest first.
 * Existing entries win on id collision, so re-importing is safe to repeat.
 */
export function mergeHistory(existing, incoming) {
    const byId = new Map();
    for (const w of incoming) byId.set(w.id, w);
    for (const w of existing) byId.set(w.id, w);

    const merged = [...byId.values()].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const added = merged.length - existing.length;
    return { merged, added, duplicates: incoming.length - added };
}

/**
 * Drops per-workout progress entries whose workout is no longer in history,
 * so localStorage doesn't grow without bound.
 */
export function pruneProgress(validIds) {
    const keep = new Set(validIds);
    const stale = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('valor_progress_') && !keep.has(key.slice('valor_progress_'.length))) {
            stale.push(key);
        }
    }
    stale.forEach(key => localStorage.removeItem(key));
    return stale.length;
}

/**
 * Triggers a file download. Returns false when the WebView blocks it, so the
 * caller can fall back to clipboard.
 */
export function downloadBackup(payload, filename) {
    try {
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return true;
    } catch {
        return false;
    }
}

/**
 * Clipboard fallback — Android WebViews often refuse anchor downloads.
 */
export async function copyBackupToClipboard(payload) {
    const text = JSON.stringify(payload, null, 2);
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        /* fall through to the legacy path */
    }
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
    } catch {
        return false;
    }
}
