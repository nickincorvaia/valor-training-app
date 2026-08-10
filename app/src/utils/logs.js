// Performance logging — what you actually lifted, as opposed to what the
// generator prescribed.
//
// Two stores, deliberately:
//   valor_session_<workoutId>  the sets you're filling in during a workout
//   valor_logs                 an index keyed by EXERCISE NAME
//
// The second one is what makes "what did I lift last time?" a single lookup
// instead of a scan across every workout in history.

const SESSION_PREFIX = 'valor_session_';
const LEGACY_PROGRESS_PREFIX = 'valor_progress_';
export const LOGS_KEY = 'valor_logs';

// Per-exercise history is capped so localStorage can't grow without bound.
const MAX_ENTRIES_PER_EXERCISE = 30;

/**
 * An exercise counts as bodyweight when there's nothing to load — the weight
 * field becomes optional "added weight" rather than the main input.
 */
export function isBodyweight(ex) {
    return ex.category === 'Bodyweight' || ex.equipment === 'None';
}

/**
 * Time-based prescriptions ("30–45s") log seconds, not reps.
 */
export function isTimeBased(ex) {
    return typeof ex.reps === 'string' && /s$/.test(ex.reps.trim());
}

function emptySet() {
    return { weight: '', reps: '', done: false };
}

export function initSession(exercises) {
    const session = {};
    exercises.forEach((ex, i) => {
        session[i] = { sets: Array.from({ length: ex.sets }, emptySet) };
    });
    return session;
}

/**
 * Loads an in-progress session, migrating the older checkbox-only format
 * (valor_progress_<id>, an array of completed exercise indices) so nobody
 * mid-workout loses their place across the update.
 */
export function loadSession(workoutId, exercises) {
    if (!workoutId || !Array.isArray(exercises)) return {};

    const fresh = initSession(exercises);

    try {
        const stored = JSON.parse(localStorage.getItem(SESSION_PREFIX + workoutId) || 'null');
        if (stored && typeof stored === 'object') {
            // Reconcile against the current prescription — set counts can differ
            // if the workout was regenerated under the same id.
            Object.keys(fresh).forEach(key => {
                const saved = stored[key];
                if (!saved?.sets) return;
                fresh[key].sets = fresh[key].sets.map(
                    (blank, i) => saved.sets[i] ?? blank
                );
            });
            return fresh;
        }
    } catch {
        /* corrupt payload — fall through to the legacy check */
    }

    try {
        const legacy = JSON.parse(
            localStorage.getItem(LEGACY_PROGRESS_PREFIX + workoutId) || 'null'
        );
        if (Array.isArray(legacy)) {
            legacy.forEach(i => {
                if (fresh[i]) fresh[i].sets = fresh[i].sets.map(s => ({ ...s, done: true }));
            });
        }
    } catch {
        /* nothing to migrate */
    }

    return fresh;
}

export function saveSession(workoutId, session) {
    if (!workoutId) return;
    localStorage.setItem(SESSION_PREFIX + workoutId, JSON.stringify(session));
}

export function readLogs() {
    try {
        const parsed = JSON.parse(localStorage.getItem(LOGS_KEY) || '{}');
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
        return {};
    }
}

export function writeLogs(logs) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

/**
 * Writes the session's recorded sets into the per-exercise index.
 * Exercises with nothing filled in are skipped rather than logged as blanks.
 */
export function commitWorkoutLogs(workout, session, unit = 'lb') {
    if (!workout?.exercises || !session) return 0;

    const logs = readLogs();
    const date = new Date().toISOString();
    let logged = 0;

    workout.exercises.forEach((ex, i) => {
        // Anything typed counts, checked off or not. The tick tracks progress
        // through the session; the numbers are the record, and silently binning
        // a set because the user forgot to tap it would lose real training data.
        const recorded = (session[i]?.sets || [])
            .filter(s => s.reps !== '' || s.weight !== '')
            .map(s => ({
                weight: s.weight === '' ? null : Number(s.weight),
                reps: s.reps === '' ? null : Number(s.reps),
            }))
            .filter(s => s.weight !== null || s.reps !== null);

        if (recorded.length === 0) return;

        const existing = logs[ex.name] || [];
        // Re-logging the same workout replaces its entry instead of duplicating.
        const deduped = existing.filter(e => e.workoutId !== workout.id);
        deduped.unshift({ date, workoutId: workout.id, unit, sets: recorded });
        logs[ex.name] = deduped.slice(0, MAX_ENTRIES_PER_EXERCISE);
        logged++;
    });

    if (logged > 0) writeLogs(logs);
    return logged;
}

/**
 * Most recent entry for an exercise, ignoring the workout in progress so the
 * card shows last session rather than what you just typed.
 */
export function getLastEntry(exerciseName, excludeWorkoutId = null, logs = null) {
    const source = logs ?? readLogs();
    const entries = source[exerciseName];
    if (!Array.isArray(entries)) return null;
    return entries.find(e => e.workoutId !== excludeWorkoutId) || null;
}

/**
 * Renders an entry the way a lifter reads it: "3×10 @ 22.5kg", or
 * "10/10/8 @ 22.5kg" when the sets weren't straight across.
 */
export function formatEntry(entry) {
    if (!entry?.sets?.length) return null;

    const { sets, unit = 'lb' } = entry;
    const reps = sets.map(s => (s.reps == null ? '–' : s.reps));
    const weights = sets.map(s => s.weight).filter(w => w != null);

    const uniformReps = new Set(reps).size === 1;
    const repPart = uniformReps ? `${sets.length}×${reps[0]}` : reps.join('/');

    if (weights.length === 0) return repPart;

    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const weightPart = min === max ? `${min}${unit}` : `${min}–${max}${unit}`;
    return `${repPart} @ ${weightPart}`;
}

/**
 * Best single set ever recorded, by weight. Used for the PR marker.
 */
export function getBestSet(exerciseName, logs = null) {
    const source = logs ?? readLogs();
    const entries = source[exerciseName];
    if (!Array.isArray(entries)) return null;

    let best = null;
    for (const entry of entries) {
        for (const set of entry.sets || []) {
            if (set.weight == null) continue;
            if (!best || set.weight > best.weight) {
                best = { weight: set.weight, reps: set.reps, unit: entry.unit || 'lb' };
            }
        }
    }
    return best;
}

/**
 * Drops sessions whose workout is no longer in history.
 */
export function pruneSessions(validIds) {
    const keep = new Set(validIds);
    const stale = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.startsWith(SESSION_PREFIX) && !keep.has(key.slice(SESSION_PREFIX.length))) {
            stale.push(key);
        }
        if (key.startsWith(LEGACY_PROGRESS_PREFIX) && !keep.has(key.slice(LEGACY_PROGRESS_PREFIX.length))) {
            stale.push(key);
        }
    }
    stale.forEach(key => localStorage.removeItem(key));
    return stale.length;
}
